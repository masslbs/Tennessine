# SPDX-FileCopyrightText: 2024 Mass Labs
#
# SPDX-License-Identifier: Unlicense
{
  description = "MassMarket Typescript Packages";
  inputs = {
    systems.url = "github:nix-systems/default";
    flake-parts.url = "github:hercules-ci/flake-parts";
    pre-commit-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    contracts = {
      url = "github:masslbs/contracts";
    };
    schema = {
      url = "github:masslbs/network-schema/cbor";
    };
    relay = {
      url = "git+ssh://git@github.com/masslbs/relay.git?ref=network-v4";
    };
  };

  outputs = inputs @ {
    nixpkgs,
    flake-parts,
    schema,
    contracts,
    pre-commit-hooks,
    relay,
    self,
    systems,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = import systems;
      imports = [
        inputs.pre-commit-hooks.flakeModule
      ];
      perSystem = {
        config,
        pkgs,
        system,
        ...
      }: {
        pre-commit = {
          check.enable = true;
          settings = {
            src = ./.;
            hooks = {
              alejandra.enable = true;
              typos = {
                # this tell typos not to check excluded files even if pre-commit tell typos to check them
                args = ["--force-exclude"];
                enable = true;
                settings = {
                  configPath = "./typos.toml";
                };
              };
              # is broken when committing ts files that are ignored
              denolint.enable = true;
              denofmt = {
                verbose = true;
                enable = true;
                settings.configPath = "./deno.json";
              };
            };
          };
        };
        devShells.default = with pkgs;
          nixpkgs.legacyPackages.${system}.mkShell {
            NETWORK_SCHEMA_PATH = "${schema}";
            MASS_TEST_VECTORS = "${schema.packages.${system}.default}";
            MASS_CONTRACTS_PATH = "${contracts.packages.${system}.default}";

            shellHook = ''
              ${config.pre-commit.settings.installationScript}
               # these fail if 'nix develop' isnt run from the root of the project
               # TODO: lets reference directly instead of copying the files
               if [ -d ./packages ]; then
                 cp $MASS_CONTRACTS_PATH/abi/*.json ./packages/contracts/abi/
                 cp $MASS_CONTRACTS_PATH/deploymentAddresses.json ./packages/contracts/
               fi
            '';

            buildInputs =
              [
                contracts.packages.${system}.default
                nodejs # needed for protobuf generation
                reuse
                # Language servers
                typos-lsp # code spell checker
                nixd
              ]
              # deno is automatically pulled in here
              ++ config.pre-commit.settings.enabledPackages;
          };
      };
    };
}

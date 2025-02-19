# SPDX-FileCopyrightText: 2024 Mass Labs
#
# SPDX-License-Identifier: Unlicense
{
  description = "massmarket-typescript";
  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    pre-commit-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    contracts = {
      url = "github:masslbs/contracts";
    };
    schema = {
      url = "github:masslbs/network-schema/v3.0";
      flake = false;
    };
  };

  outputs = inputs @ {
    nixpkgs,
    flake-parts,
    schema,
    contracts,
    pre-commit-hooks,
    self,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = ["x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin"];
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
              typos.enable = true;
              # is broken when committing ts files that are ignored
              # denolint.enable = true;
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
            shellHook = ''
              ${config.pre-commit.settings.installationScript}
               # these fail if 'nix develop' isnt run from the root of the project
               if [ -d ./packages ]; then
                 cp ${schema}/testVectors.json ./packages/schema/testVectors.json
                 cp $MASS_CONTRACTS_PATH/abi/*.json ./packages/contracts/abi/
                 cp $MASS_CONTRACTS_PATH/deploymentAddresses.json ./packages/contracts/
               fi
            '';

            buildInputs =
              [
                typos # code spell checker
                typos-lsp
                nixd # lsp for nix
                deno
                contracts.packages.${system}.default
                reuse
              ]
              ++ config.pre-commit.settings.enabledPackages;

            NETWORK_SCHEMA_PATH = "${schema}";
            MASS_CONTRACTS_PATH = "${contracts.packages.${system}.default}";
          };
      };
    };
}

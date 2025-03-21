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
    relay = {
      url = "git+ssh://git@github.com/masslbs/relay.git?ref=network-v4";
    };
    contracts.follows = "relay/contracts";
    # schema.follows = "relay/schema";
    schema.url = "github:masslbs/network-schema/cbor";
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
              #TODO: tries to download modules on nix flake check
              denolint = {
                enable = true;
                settings.configPath = "./deno.json";
              };
              denofmt = {
                enable = true;
                settings.configPath = "./deno.json";
              };
            };
          };
        };
        devShells.default = pkgs.mkShell {
          MASS_TEST_VECTORS = "${schema.packages.${system}.default}";
          MASS_CONTRACTS_PATH = "${contracts.packages.${system}.default}";

          shellHook = ''
            ${config.pre-commit.settings.installationScript}
            # only runs when the contracts have changed
            if [ $(cat .last-input) != "${contracts}" ]; then
              echo ${contracts} > .last-input
              deno task -r -f contracts build
            fi
          '';

          buildInputs = with pkgs;
            [
              contracts.packages.${system}.local-testnet
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

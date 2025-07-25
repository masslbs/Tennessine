# SPDX-FileCopyrightText: 2024 Mass Labs
#
# SPDX-License-Identifier: Unlicense
{
  description = "MassMarket Typescript Packages";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-root.url = "github:srid/flake-root";
    pre-commit-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    relay.url = "github:masslbs/relay";
    contracts.follows = "relay/contracts";
    schema.follows = "relay/schema";
    # in case we need to test new vectors, etc. we can override the input like this:
    # schema.url = "github:masslbs/network-schema/myBranch
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
        inputs.flake-root.flakeModule
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
          inputsFrom = [config.flake-root.devShell]; # Provides $FLAKE_ROOT in dev shell
          MASS_TEST_VECTORS = "${schema.packages.${system}.default}";
          NETWORK_SCHEMA_PATH = "${schema}";
          MASS_CONTRACTS_PATH = "${contracts.packages.${system}.default}";

          shellHook = ''
                        ${config.pre-commit.settings.installationScript}

                        if [ -z IPFS_PATH ]; then
                          export IPFS_PATH=$FLAKE_ROOT/data/ipfs
                        fi
                        pushd $FLAKE_ROOT
                        # only runs when the contracts have changed
                        touch .last-input
                        if [[ "$(< .last-input)" != "${contracts}" ]]; then
                          echo ${contracts} > .last-input
                          deno task -r -f contracts build
                        fi
                        popd
                        # Bright blue ANSI color: \033[1;34m ... \033[0m
                        echo -e "\033[1;34m\
             ╔══════════════∘∴∴∵∴∘═════════════════╗\n\
            :║ ███████████████████████████████████ ║:\n\
            :║ ████  M Λ S S   M Λ R K Ξ T ███████ ║:\n\
            :║ ███████████████████████████████████ ║:\n\
             ╚══════════════∘∴∴∵∴∘═════════════════╝\033[0m"
          '';

          buildInputs = with pkgs;
            [
              relay.packages.${system}.local-testnet
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

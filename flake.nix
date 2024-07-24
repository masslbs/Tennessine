# SPDX-FileCopyrightText: 2024 Mass Labs
#
# SPDX-License-Identifier: Unlicense

{
  description = "massmarket-typescript";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
    pre-commit-hooks.url = "github:cachix/pre-commit-hooks.nix";
    pre-commit-hooks.inputs.nixpkgs.follows = "nixpkgs";
    contracts.url = "github:masslbs/contracts";
    contracts.inputs.nixpkgs.follows = "nixpkgs";
    schema = {
      url = "github:masslbs/network-schema";
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
        self',
        ...
      }: {
        pre-commit.settings = {
          src = ./.;
          hooks = {
            alejandra.enable = true;
            prettier.enable = true;
            prettier.settings.write = true;
          };
        };
        devShells.default = with pkgs;
          nixpkgs.legacyPackages.${system}.mkShell {
            shellHook = ''
              # these fail if 'nix develop' isnt run from the root of the project
              if [ -d ./packages ]; then
                cp ${schema}/testVectors.json ./packages/schema/testVectors.json
                cp $MASS_CONTRACTS_PATH/abi/*.json ./packages/contracts/abi/
                cp $MASS_CONTRACTS_PATH/deploymentAddresses.json ./packages/contracts/
                prettier -w ./packages/schema/testVectors.json ./packages/contracts/deploymentAddresses.json
              fi
            '';

            buildInputs =
              [
                # frontend dependencies
                typescript
                nodejs_latest
                nodePackages.pnpm
                nodePackages.typescript-language-server
                playwright-driver.browsers
                contracts.packages.${system}.default
                reuse
              ]
              ++ config.pre-commit.settings.enabledPackages;

            NETWORK_SCHEMA_PATH = "${schema}";
            MASS_CONTRACTS_PATH = "${contracts.packages.${system}.default}";
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
            PLAYWRIGHT_NODEJS_PATH = "${pkgs.nodejs}/bin/node";
            PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
            PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH = "${pkgs.playwright-driver.browsers}/chromium-1091/chrome-linux/chrome";
          };
      };
    };
}

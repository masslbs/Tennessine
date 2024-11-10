# SPDX-FileCopyrightText: 2024 Mass Labs
#
# SPDX-License-Identifier: Unlicense
{
  description = "massmarket-typescript";
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    deno-overlay.url = "github:haruki7049/deno-overlay";
    flake-parts.url = "github:hercules-ci/flake-parts";
    pre-commit-hooks.url = "github:cachix/pre-commit-hooks.nix";
    pre-commit-hooks.inputs.nixpkgs.follows = "nixpkgs";
    contracts.url = "github:masslbs/contracts";
    contracts.inputs.nixpkgs.follows = "nixpkgs";
    schema = {
      url = "github:masslbs/network-schema/327c7a8896e6d41ca137f9e92038047141982dc4";
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
    deno-overlay,
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
        _module.args.pkgs = import inputs.nixpkgs {
            inherit system;
            overlays = [
              deno-overlay.overlays.deno-overlay
            ];
             config = { };
        };
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
              fi
            '';

            buildInputs =
              [
                # frontend dependencies
                deno."2.0.6"
                typescript
                nodejs_latest
                nodePackages.typescript-language-server
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

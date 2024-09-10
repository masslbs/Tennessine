# Use an Ubuntu base image
FROM ubuntu:20.04

# Set environment variables for non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install required dependencies
RUN apt-get update && \
    apt-get install -y curl wget sudo xz-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m nixuser

# Create the /nix directory and give ownership to nixuser
RUN mkdir -m 0755 /nix && chown nixuser /nix

# Switch to the new user
USER nixuser

# Set the home directory
ENV HOME=/home/nixuser

# Install Nix for the non-root user
RUN curl -L https://nixos.org/nix/install | sh

RUN mkdir /home/nixuser/app

WORKDIR /home/nixuser/app

COPY --chown=nixuser:nixuser . .

# Source the Nix profile for all users
ENV PATH=/home/nixuser/.nix-profile/bin:$PATH

RUN nix develop --extra-experimental-features nix-command --extra-experimental-features flakes

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
ENV PATH=/home/nixuser/.local/share/pnpm:$PATH
RUN nix develop --extra-experimental-features nix-command --extra-experimental-features flakes && \
    pnpm install && \
    /nix/store/*-typescript-*/bin/tsc -b

# The following command goes to the frontend folder and run frontend for external call.
CMD nix develop --extra-experimental-features nix-command --extra-experimental-features flakes --command bash -c "cd packages/frontend && pnpm dev"
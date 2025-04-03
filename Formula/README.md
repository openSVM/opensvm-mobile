# Homebrew Formula

This directory contains the Homebrew formula for the OpenSVM-Dioxus application. The formula is automatically updated by the CI/CD pipeline when a new release is created.

## Installation

To install the OpenSVM-Dioxus application using Homebrew:

```bash
# Add the tap (only needed once)
brew tap openSVM/opensvm-mobile https://github.com/openSVM/opensvm-mobile.git

# Install the application
brew install opensvm-dioxus
```

## Updating

To update to the latest version:

```bash
brew update
brew upgrade opensvm-dioxus
```

## Manual Formula Management

The formula is automatically updated by the CI/CD pipeline, but if you need to manually update it:

1. Calculate the SHA256 hash of the release artifact:
   ```bash
   curl -L -o opensvm-dioxus-macos.zip "https://github.com/openSVM/opensvm-mobile/releases/download/v{VERSION}/opensvm-dioxus-macos.zip"
   shasum -a 256 opensvm-dioxus-macos.zip
   ```

2. Update the formula with the new version and SHA256 hash

3. Commit and push the changes

4. Create a pull request to merge the changes into the main branch
# GitHub Actions Workflows

This directory contains GitHub Actions workflow configurations for the OpenSVM-Dioxus project.

## CI Workflow (`ci.yml`)

The CI workflow automates building, testing, and releasing the OpenSVM-Dioxus application.

### Triggers

- **Push to main branch**: Runs build and tests
- **Pull requests to main branch**: Runs build and tests
- **Release publication**: Runs build, tests, and creates release artifacts

### Jobs

1. **build-and-test**: Builds and tests the application on Ubuntu, macOS, and Windows
2. **build-web**: Builds the web (WASM) version of the application
3. **build-desktop**: Builds desktop versions for Linux, macOS (Intel and Apple Silicon), and Windows
4. **build-android**: Builds the Android APK
5. **create-release**: Collects all artifacts and attaches them to the GitHub release
6. **homebrew**: Creates and updates a Homebrew formula for easy installation on macOS

### Usage

#### Regular Development

The CI workflow automatically runs on every push to the main branch and on pull requests to ensure code quality.

#### Creating a Release

To create a new release with binaries:

1. Go to the GitHub repository
2. Click on "Releases" in the sidebar
3. Click "Draft a new release"
4. Create a new tag (e.g., `v0.1.0`)
5. Fill in the release title and description
6. Click "Publish release"

The workflow will automatically build all platform binaries and attach them to the release. It will also update the Homebrew formula for macOS users.

#### Installing via Homebrew

After a release is published, macOS users can install the application using Homebrew:

```bash
# Add the tap (first time only)
brew tap opensvm/opensvm

# Install the application
brew install opensvm-dioxus
```

### Customization

To modify the CI workflow:

1. Edit the `.github/workflows/ci.yml` file
2. Commit and push your changes
3. The updated workflow will be used for subsequent runs
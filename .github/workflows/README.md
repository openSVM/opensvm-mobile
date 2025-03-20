# GitHub Actions Workflows

This directory contains GitHub Actions workflow definitions for automating the build, test, and release processes for the OpenSVM-Dioxus project.

## CI/CD Pipeline (`ci.yml`)

This workflow handles the continuous integration and continuous deployment process for the OpenSVM-Dioxus project.

### Triggers

- **Push** to the `main` branch
- **Push** of tags matching the pattern `v*` (e.g., `v1.0.0`)
- **Pull requests** targeting the `main` branch

### Jobs

#### 1. Build & Test

This job builds and tests the application across multiple platforms:

- **Web (WASM)** - Built on Ubuntu
- **Desktop (macOS)** - Built on macOS
- **Desktop (Windows)** - Built on Windows
- **Android** - Built on Ubuntu

Each platform build includes platform-specific optimizations:

- **Web**: WASM optimization with `wasm-opt`
- **Desktop**: Native CPU instructions with `-C target-cpu=native`
- **Android**: APK optimization with `zipalign` and `apksigner`

#### 2. Release

This job is triggered only when a tag matching the pattern `v*` is pushed. It:

- Downloads all build artifacts
- Packages them into platform-specific ZIP files
- Creates a GitHub release with the packaged artifacts
- Generates release notes automatically

#### 3. Homebrew Formula Update

This job is triggered only when a tag matching the pattern `v*` is pushed. It:

- Creates or updates a Homebrew formula for the macOS release
- Calculates the SHA256 hash of the macOS release artifact
- Creates a pull request to update the formula

#### 4. Android Build

This job builds the Android APK and:

- Optimizes the APK with `zipalign`
- Signs the APK with a debug key
- Uploads the APK as an artifact
- Adds the APK to the GitHub release (if triggered by a tag)

## Usage

### Regular Development

The CI pipeline will automatically run on all pull requests to validate changes.

### Creating a Release

To create a new release:

1. Create and push a new tag following semantic versioning:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. The workflow will automatically:
   - Build all platform versions
   - Create a GitHub release with all artifacts
   - Update the Homebrew formula

### Customizing the Workflow

To modify the workflow:

1. Edit the `.github/workflows/ci.yml` file
2. Commit and push your changes
3. The updated workflow will be used for subsequent runs
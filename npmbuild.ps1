# Define the path to the package.json directory
$projectPath = "YOUR_PATH_TO_THE_PROJECT"

# Navigate to the directory
if (Test-Path $projectPath) {
    Write-Output "Navigating to $projectPath..."
    Set-Location $projectPath
} else {
    Write-Output "Error: Path $projectPath does not exist."
    exit 1
}

# Check if package.json exists in the directory
if (-Not (Test-Path "$projectPath\package.json")) {
    Write-Output "Error: package.json not found in $projectPath."
    exit 1
}

# Run the npm build command
Write-Output "Running 'npm run build'..."
npm run build

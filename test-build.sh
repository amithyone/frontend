#!/bin/bash

echo "Testing React app build..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the app
echo "Building the app..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! dist/ directory created."
    ls -la dist/
else
    echo "❌ Build failed! dist/ directory not found."
    exit 1
fi

echo "✅ Ready for deployment!"

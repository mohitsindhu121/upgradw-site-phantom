#!/bin/bash
# Install all dependencies including dev dependencies
npm install --include=dev

# Build the frontend
npx vite build

# Build the backend
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
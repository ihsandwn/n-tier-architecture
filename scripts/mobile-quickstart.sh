#!/bin/bash
# Quick Start Script for Mobile App

echo "🚀 OmniLogistics Mobile App - Quick Start"
echo "========================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js"
    exit 1
fi

# Navigate to mobile directory
cd apps/mobile

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "📱 Starting Mobile App..."
echo ""
echo "Available commands:"
echo "  npm run dev         - Start Expo development server"
echo "  npm run android     - Run on Android"
echo "  npm run ios         - Run on iOS"
echo "  npm run web         - Run on Web"
echo ""
echo "🔐 Demo Credentials:"
echo "  Email: demo@example.com"
echo "  Password: password123"
echo ""
echo "📖 Documentation:"
echo "  - See IMPLEMENTATION.md for detailed guide"
echo "  - See SYNC_IMPLEMENTATION_SUMMARY.md for overview"
echo ""
echo "Press Ctrl+C to stop the development server"
echo ""

# Start the development server
npm run dev

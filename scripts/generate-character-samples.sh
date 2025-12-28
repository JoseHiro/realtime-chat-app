#!/bin/bash

# Script to generate MP3 samples for all characters
# Each character will have multiple unique phrases generated
# Usage: ./scripts/generate-character-samples.sh [characterName]

BASE_URL="http://localhost:3000"
CHARACTER="${1:-}"

echo "🎤 Generating character audio samples with unique phrases..."
if [ -n "$CHARACTER" ]; then
  echo "Character: $CHARACTER"
else
  echo "Generating for all characters..."
fi
echo ""

# Make POST request
if [ -n "$CHARACTER" ]; then
  curl -X POST "$BASE_URL/api/generate-character-samples" \
    -H "Content-Type: application/json" \
    -d "{\"characterName\": \"$CHARACTER\"}" \
    | jq '.'
else
  curl -X POST "$BASE_URL/api/generate-character-samples" \
    -H "Content-Type: application/json" \
    -d "{}" \
    | jq '.'
fi

echo ""
echo "✅ Done! Check public/audio/characters/ for the generated files."
echo "Each character will have multiple MP3 files (e.g., sakura_1.mp3, sakura_2.mp3, sakura_3.mp3)"

#!/bin/bash

set -e

# Input and output file paths
INPUT_FILE="/input/$1"
OUTPUT_DIR="/output"

# Ensure the output directory exists
mkdir -p "$OUTPUT_DIR"

# Convert to various resolutions in parallel
ffmpeg -i "$INPUT_FILE" -vf "scale=-2:720" -c:v libx264 -preset fast -c:a aac  "$OUTPUT_DIR/output_720p.mp4" &
ffmpeg -i "$INPUT_FILE" -vf "scale=-2:480" -c:v libx264 -preset fast -c:a aac  "$OUTPUT_DIR/output_480p.mp4" &
ffmpeg -i "$INPUT_FILE" -vf "scale=-2:360" -c:v libx264 -preset fast -c:a aac  "$OUTPUT_DIR/output_360p.mp4" &
ffmpeg -i "$INPUT_FILE" -vf "scale=-2:1080" -c:v libx264 -preset fast -c:a aac "$OUTPUT_DIR/output_1080p.mp4" &

# Wait for all background processes to complete
wait
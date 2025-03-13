#!/bin/bash -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script's directory
cd "$SCRIPT_DIR" || exit
cd ..

# Define the log file path
LOG_FILE="schedule-run.log"

# Define the line to append
# Get the current date and time in the desired format
CURRENT_DATE_TIME=$(date +"%Y-%d-%m %H:%M")

# Append the formatted date and time to the log file
echo "$CURRENT_DATE_TIME" >> "$LOG_FILE"

# Optional: Print a message indicating the operation was successful
echo "Current date and time appended to $LOG_FILE"
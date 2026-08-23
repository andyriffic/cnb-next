#!/bin/bash -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script's directory
cd "$SCRIPT_DIR" || exit
cd ..

./cdk/scripts/destroy.sh "$@"

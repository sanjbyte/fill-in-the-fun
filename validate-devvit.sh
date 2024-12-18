#!/bin/bash

echo "Validating devvit.yaml..."

# Define your expected description and post_type
EXPECTED_DESCRIPTION="A daily fill-in-the-blank game for your subreddit!"
EXPECTED_POST_TYPE="self"

# Extract current values from devvit.yaml
CURRENT_DESCRIPTION=$(grep "description:" devvit.yaml | cut -d ':' -f 2- | xargs)
CURRENT_POST_TYPE=$(grep "post_type:" devvit.yaml | cut -d ':' -f 2- | xargs)

# Validate description
if [[ "$CURRENT_DESCRIPTION" != "$EXPECTED_DESCRIPTION" ]]; then
  echo "ERROR: devvit.yaml description does not match expected value."
  echo "Expected: $EXPECTED_DESCRIPTION"
  echo "Found: $CURRENT_DESCRIPTION"
  exit 1
fi

# Validate post_type
if [[ "$CURRENT_POST_TYPE" != "$EXPECTED_POST_TYPE" ]]; then
  echo "ERROR: devvit.yaml post_type does not match expected value."
  echo "Expected: $EXPECTED_POST_TYPE"
  echo "Found: $CURRENT_POST_TYPE"
  exit 1
fi

echo "devvit.yaml validated successfully. Proceeding with upload..."

# Run devvit upload
devvit upload

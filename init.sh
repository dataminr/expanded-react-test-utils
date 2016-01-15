#!/bin/sh

# colors
COLOR_RED="\x1b[31m"
COLOR_GREEN="\x1b[32m"
COLOR_RESET="\x1b[0m"

# perform fresh install of dependencies
rm -rf node_modules
rm -rf coverage
rm -rf app/dist
npm cache clean
npm install

if [ $? -ne 0 ]; then
  echo "$COLOR_RED"
  echo "\nINIT FAILED!\n"
  exit 1
fi

echo "$COLOR_GREEN"
echo "\nINIT RAN SUCCESSFULLY\n"

echo "At any time you may:"
echo "--------------------"
echo "grunt -h    # show available tasks"
echo ""

echo "$COLOR_RESET"
exit 0

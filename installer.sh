#!/bin/sh
#
# Run this installer to install the pre-commit hook by running
#    `sh installer.sh`

# Install necessary Node modules
npm install -g gulp

# Install all Node modules listed in package.json
npm install

# Make sure there is a valid config file
# (without overwriting a possible existing one)
if [ -e tasks/config.json ]; then
    echo -e "\033[31mConfig already exists\033[0m => Copy config.json.template to config.json if you want to start from scratch"
else
    echo "Copying config file => Make sure to check placeholders!"
    cp -n tasks/config.json.template tasks/config.json
fi

echo ""
echo -e "\033[42mDONE!\033[0m"
echo ""
echo "Check the README for more details!"

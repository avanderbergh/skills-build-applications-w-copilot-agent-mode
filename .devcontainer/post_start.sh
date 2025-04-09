#!/bin/bash
# This script is run after the container is started.

# open ports for Python Django server and React app
gh cs ports visibility 8000:public -c $CODESPACE_NAME
gh cs ports visibility 3000:public -c $CODESPACE_NAME
gh cs ports visibility 27017:public -c $CODESPACE_NAME
gh cs ports visibility 8081:public -c $CODESPACE_NAME
gh cs ports visibility 6080:public -c $CODESPACE_NAME

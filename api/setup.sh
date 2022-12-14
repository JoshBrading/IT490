#!/bin/bash

# Get the current working directory.
cwd=$(pwd)

# Get the parent directory of the script.
parent_dir=$(dirname "$0")

# Construct the path to the virtual environment.
venv_path="$parent_dir/venv"

# Check if python3 is installed.
if command -v python3 >/dev/null; then
    echo "Python is installed"
else
    echo "Python is not installed"
    echo "Installing Python..."
    sudo apt-update
    sudo apt-get install -y python3
    echo "Python installed"
fi

# Check if pip3 is installed.
if command -v pip3 >/dev/null; then
    echo "pip is installed"
else
    echo "pip is not installed"
    echo "Installing pip..."
    sudo apt-get install -y python3-pip
    echo "pip installed"
fi

# Check if virtualenv is installed.
if command -v virtualenv >/dev/null; then
    echo "virtualenv is installed"
else
    echo "virtualenv is not installed"
    echo "Installing virtualenv..."
    sudo apt-get install -y virtualenv
    echo "virtualenv installed"
fi

# Setup a virtual environment for python.
virtualenv "$venv_path"

# Activate the virtual environment.
source "$venv_path/bin/activate"

# Install the python requirements.
pip3 install -r /path/to/requirements.txt

# Generate the config.py file.
echo "BROKER_HOST = ''" > config.py
echo "BROKER_PORT = ''" >> config.py
echo "USER = ''" >> config.py
echo "PASSWORD = ''" >> config.py
echo "VHOST = ''" >> config.py
echo "EXCHANGE = ''" >> config.py
echo "QUEUE = ''" >> config.py
echo "AUTO_DELETE = 'true'" >> config.py

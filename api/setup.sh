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
pip3 install -r "$parent_dir"/requirements.txt

# Prompt the user for the config.py parameters.
echo "Enter the BROKER_HOST: "
read BROKER_HOST
echo "Enter the BROKER_PORT: "
read BROKER_PORT
echo "Enter the USER: "
read USER
echo "Enter the PASSWORD: "
read PASSWORD
echo "Enter the VHOST: "
read VHOST
echo "Enter the EXCHANGE: "
read EXCHANGE
echo "Enter the QUEUE: "
read QUEUE

# Generate the config.py file.
echo "BROKER_HOST = '$BROKER_HOST'" > config.py
echo "BROKER_PORT = '$BROKER_PORT'" >> config.py
echo "USER = '$USER'" >> config.py
echo "PASSWORD = '$PASSWORD'" >> config.py
echo "VHOST = '$VHOST'" >> config.py
echo "EXCHANGE = '$EXCHANGE'" >> config.py
echo "QUEUE = '$QUEUE'" >> config.py
echo "AUTO_DELETE = 'true'" >> config.py

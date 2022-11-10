echo Checking if Python is installed...
missing_py = setup.sh line 3: python: command not found
result=$(python3 --version)

if [[ $result -ge missing_py ]]
then
    echo Python is not installed
    echo Installing Python...
    sudo apt-update
    sudo apt-get install python3
    echo Python installed
else
    echo Python is installed
fi

echo Checking if pip is installed...
missing_pip = setup.sh line 9: pip: command not found
result=$(pip3 --version)
if [[ $result -ge missing_pip ]]
then
    echo pip is not installed
    echo Installing pip...
    sudo apt-get install python3-pip
    echo pip installed
else
    echo pip is installed
fi

echo Checking if virtualenv is installed...
missing_venv = setup.sh line 15: virtualenv: command not found
result=$(virtualenv --version)
if [[ $result -ge missing_venv ]]
then
    echo virtualenv is not installed
    echo Installing virtualenv...
    sudo apt-get install virtualenv
    echo virtualenv installed
else
    echo virtualenv is installed
fi

echo Setting up virtualenv
virtualenv venv
echo Activating virtualenv
source venv/bin/activate

echo Installing requirements.txt
pip3 install -r requirements.txt

echo Generating config.py
echo BROKER_HOST = "" > config.py
echo BROKER_PORT = "" >> config.py
echo USER = "" >> config.py
echo PASSWORD = "" >> config.py
echo VHOST = "" >> config.py
echo EXCHANGE = "" >> config.py
echo QUEUE = "" >> config.py
echo AUTO_DELETE = "true" >> config.py


echo Done!
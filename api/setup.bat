@ECHO OFF
ECHO Virtual environment setup
python -m venv venv
ECHO Activating virtual environment...
call .\venv\Scripts\activate
ECHO Installing requirements...
pip install -r requirements.txt
ECHO Generating config.py
echo BROKER_HOST = "" > config.py
echo BROKER_PORT = "" >> config.py
echo USER = "" >> config.py
echo PASSWORD = "" >> config.py
echo VHOST = "" >> config.py
echo EXCHANGE = "" >> config.py
echo QUEUE = "" >> config.py
echo AUTO_DELETE = "true" >> config.py
ECHO Done!

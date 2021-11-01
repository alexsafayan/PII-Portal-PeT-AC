# PII-Portal

## To install the portal
1. Frontend (need node installed)
    1. cd Portal && npm start
2. Backend (need python and pip)
    1. python -venv venv
    2. Mac:
        1. source venv/lib/activate
    3. Windows: 
        1. run "%mypath%\venv\scripts\activate.bat
    3. pip install -r requirements.txt
    
## To start the portal

### Windows: 
1. run start_portal.bat

### Mac: 
1. Start 4 terminals and navigate to root folder of portal
    1. run source venv/lib/activate && cd PortalBackend && python manage.py runserver 0.0.0.0:8000
    2. run source venv/lib/activate && cd PortalBackend && python surface_web.py"
    3. run source venv/lib/activate && cd crawler && scrapyrt
    4. cd Portal && npm start

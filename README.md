# AZSecure Privacy Portal

## To install the portal
1. Frontend (requirements: node, npm)
    1. cd Portal && npm install
2. Backend (requirements: python, pip)
    1. python -venv venv
    2. Mac:
        1. source venv/lib/activate
    2. Windows: 
        1. run "%mypath%\venv\scripts\activate.bat
    3. pip install -r requirements.txt
    
## To start the portal

### Windows: 
1. run start_portal.bat

### Mac: 
1. Navigate to root folder of portal
2. Open 4 terminals
    1. Terminal 1: run source venv/bin/activate && cd PortalBackend && python manage.py runserver 0.0.0.0:8000
    2. Terminal 2: run source venv/bin/activate && cd PortalBackend && python surface_web.py"
    3. Terminal 3: run source venv/bin/activate && cd crawler && scrapyrt
    4. Terminal 4: cd Portal && npm start

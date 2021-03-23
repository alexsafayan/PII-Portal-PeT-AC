set mypath=%cd%

start cmd /k "%mypath%\venv\scripts\activate.bat && cd %mypath%\PortalBackend && python manage.py runserver 0.0.0.0:8000"
start cmd /k "cd %mypath%\Portal && npm start"
start cmd /k "%mypath%\venv\scripts\activate.bat && cd %mypath%\PortalBackend && python surface_web.py"
start cmd /k "%mypath%\venv\scripts\activate.bat && cd %mypath%\crawler && scrapyrt"



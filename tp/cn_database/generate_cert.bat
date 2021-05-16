set OpenSsl_Home=C:\Program Files\OpenSSL-Win64
set PATH=%OpenSsl_Home%\bin;%PATH%
REM openssl genrsa -out private-key.key 2048
REM openssl req -new -key private-key.key -out csr.txt
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout selfsigned.key -out selfsigned.crt
pause
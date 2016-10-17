cd src
COPY .\index.html ..\dist\index.html
.\node_modules\.bin\browserify -t [ babelify ] .\js\main.jsx -o ..\dist\bundle.js
REM .\node_modules\.bin\browserify -t [ babelify ] .\js\main.jsx | .\node_modules\.bin\uglifyjs > ..\dist\bundle.js
cd ..
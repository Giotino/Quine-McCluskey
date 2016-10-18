cd src
COPY .\index.html ..\cordova\www\index.html
XCOPY .\css ..\cordova\www\css\ /Y
XCOPY .\js ..\cordova\www\js\ /Y
.\node_modules\.bin\browserify -t [ babelify ] .\js\main.jsx -o ..\cordova\www\bundle.js
cd ..
REM .\node_modules\.bin\browserify -t [ babelify ] .\js\main.jsx | .\node_modules\.bin\uglifyjs > ..\dist\bundle.js
cd src
cp ./index.html ../cordova/www/index.html
cp -r ./css ../cordova/www/css
cp -r ./js ../cordova/www/js
./node_modules/.bin/browserify -t [ babelify ] ./js/main.jsx -o ../cordova/www/bundle.js
cd ..
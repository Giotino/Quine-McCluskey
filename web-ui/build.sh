cd src
cp ./index.html ../dist/index.html
./node_modules/.bin/browserify -t [ babelify ] ./js/main.jsx | ./node_modules/.bin/uglifyjs > ../dist/bundle.js
cd ..
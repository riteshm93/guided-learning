# guided-learning
Guided learning solution POC


## Installation and Usage
- run `npm install`
- run `npm start`
- open google.com in browser
- open browser devtools reference: https://javascript.info/devtools
- go to Console section in Devtool
- paste this block and enter
```
var s = document.createElement("script");
s.src = "http://127.0.0.1:8080/player.js";
s.type = "text/javascript";
document.body.appendChild(s);
```

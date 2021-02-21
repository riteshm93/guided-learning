# Guided Learning Solution
Guided learning solution POC

This is a POC for a Guided Learning Solution(GLS). GLS is a solution that enables step by step guidance on top of any web interface.

This POC is intended to build a javascript player that will eventually run a guide on google.com.

#### Note
- Currently selector element for first step is not available at google.com
- For the sake of completion of POC, i have hardcoded best suitable value for the selector of first step.

## Setup Instructions
### Dependencies Installation
First of all, make sure you have all prerequisites installed:
- *npm* version 3+
- run `npm install`

### Usage
- run `npm start`
- open [google.com](https://www.google.com) in browser
- open browser Devtool [reference link](https://javascript.info/devtools)
- go to Console section in Devtool
- paste below code block and enter to start the guide

```javascript
var s = document.createElement("script");
s.src = "http://127.0.0.1:8080/player.js";
s.type = "text/javascript";
document.body.appendChild(s);
```

**Enjoy this Guided Learning Solution :)**

# Guided Learning Solution
Guided learning solution POC

This is a POC for a Guided Learning Solution(GLS). GLS is a solution that enables step by step guidance on top of any web interface.

This POC is intended to build a javascript player that will eventually run a guide on google.com.

#### Note
- Please see last section of this file for details on all assumptions for this project.
- Currently selector element for first step is not available at google.com
- For the sake of completion of POC, i have hardcoded best suitable value for the selector of first step.

## Setup Instructions
### Dependencies Installation
First of all, make sure you have all prerequisites installed:
- *npm* version 3+ is required
- clone this repository
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
document.body.appendChild(s).onload = () => { initGuidedLearning(); };
```

- after above step you can show tooltip for any step using this command in console. where stepId is step.id from guideData
```javascript
addTooltip(<stepId>);
```

- to run automated flow from any step use above command with an additional parameter as true
```javascript
addTooltip(<stepId>, true);
```

[Working setup and demo video](https://youtu.be/EJj86n1Bm8E)

## Assumptions
### GuideData meaning (assumption) and any specific implementation usage
- **steps.id** -> Id of the step
- **steps.action** -> set of actions required to perform for this step
- **steps.action.type** -> type of tiplate to be used in tooltip, or closeScenario for guide end
- **steps.action.contents** -> various contents for the tooltip
- **steps.action.contents.#content** -> content for the tooltip
- **steps.action.roleTexts** -> specific texts for tooltip buttons based on step role, ex: Next can be Done on guide end
- **steps.action.placement** -> tooltip placement detail, added as css class
- **steps.action.classes** -> additional classes to be used for customizing tooltip
- **steps.action.selector** -> selector for the webpage to set step tooltip
- **steps.action.stepOrdinal** -> current step number (as step.id can be different and unordered)
- **steps.action.onlyOneTip** -> boolean flag to indicate if onlyOneTip is allowed or multiple is allowed
- **steps.action.watchSelector** -> boolean flag to indicate if onlyOneTip is allowed or multiple is allowed
- **steps.action.warningTimeout** -> boolean flag to indicate if onlyOneTip is allowed or multiple is allowed
- **steps.action.watchDog** -> boolean flag to indicate to use watchDog and perform rescue if guide is stuck
- **steps.action.wdInterval** -> time interval to trigger watchdog step, i.e. trigger next valid step
- **steps.followers** -> details on next possible steps
- **steps.followers.condition** -> condition to be meet to go to next step
- **steps.followers.next** -> next step id (step.id)
- **tiplates** -> various tiplates HTML data which can be used for tooltip
- **css** -> css to customize tooltip styling

### Assumption for logic
- first element of the steps will be the first step of the guide.
- automated guide step flow, based on watchSelector value and warningTimeout as interval
- using followers first step as next step.

### Hardcoded/Modified data
- unable to find selector for first step i.e. `"#hplogo"`, to have a good starting point for demo i have modified it to a valid selector `.lnXdpd`.(if not modified watchdog will get triggered and guide will start with step 2)
- add additional minor custom styling in addition to already used css and class to improve tooltip styling

**Enjoy this Guided Learning Solution :)**

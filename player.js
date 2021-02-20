var guideSteps = [];
var tiplates = {};


/**
 * Init guided learning for current website
 * 
 * Make Jquery available to current website, Jquery is required for performing various action for dom manipulation to show guide steps.
 * Make default Stylesheet for guide available to current website.
 * Finally get guided steps data and use callback to process guide data and start guided learning on current website.  
*/
function initGuidedLearning() {
    var jqueryScript = document.createElement("script");
    jqueryScript.src = "https://code.jquery.com/jquery-3.5.1.min.js";
    document.body.appendChild(jqueryScript);

    var guidedLearningCssLink = document.createElement("link");
    guidedLearningCssLink.rel = "stylesheet";
    guidedLearningCssLink.href = "https://guidedlearning.oracle.com/player/latest/static/css/stTip.css";
    document.body.appendChild(guidedLearningCssLink);

    var guideDataScript = document.createElement("script");
    guideDataScript.src = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=processGuideData";
    document.body.appendChild(guideDataScript);
}


/**
 * Process guide data
 * 
 * Store guideSteps and tiplates.
 * Calls add tooltip for first step.
 * Alerts if data is invalid.
 * 
 * @param {Object}      guideDataResponse
*/
function processGuideData(guideDataResponse) {
    if (guideDataResponse.success === 1 && guideDataResponse.data.structure.steps.length > 0) {
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(guideDataResponse.data.css));
        document.head.appendChild(style);

        guideSteps = guideDataResponse.data.structure.steps;
        tiplates = guideDataResponse.data.tiplates;

        // TODO: Remove this hardcoded value once data is updated
        // Hardcoded value for first step selector
        guideSteps[0].action.selector = ".lnXdpd"

        addTooltip(guideSteps[0].id);
    } else {
        alert("Failed to get Guided Learning Steps");
    }
}


/**
 * Add tooltip for given step id.
 * 
 * @param {String}      stepId
*/
function addTooltip(stepId) {
    step = guideSteps.filter(step => step.id === stepId)[0];

    // TODO: Handle when type is closeScenario
    stepTooltip = generateTooltip(step);

    stepSelector = jQuery(step.action.selector);
    if (stepSelector) {
        jQuery(".sttip").remove();
        stepSelector.after(stepTooltip);

        // Add event handlers for tooltip buttons
        document.querySelector('[data-iridize-role="prevBt"]').onclick = () => {
            previousStep = guideSteps.filter(step => (step.followers[0] || {})["next"] === stepId)[0]
            if (previousStep) {
                addTooltip(previousStep.id);
            }
            // Reached first step of the guide
            else if (confirm("You have reached the beginning of the guide\nClick OK to close the guide.\nClick Cancel to watch guide again.")) {
                jQuery(".sttip").remove();
            }
        }

        document.querySelector('[data-iridize-role="nextBt"]').onclick = () => {
            addTooltip(step.followers[0].next);
        }

        document.querySelector('[data-iridize-role="closeBt"]').onclick = () => {
            jQuery(".sttip").remove();
        }
    }
}

/**
 * Generate tooltip data for given step.
 * 
 * Uses step data in default template and tiplate to generate tooltip HTML data.
 * Also add class based on step classes and placement data.
 * 
 * @param {Object}      step
 * 
 * @returns {String}    tooltip data for given step
*/
function generateTooltip(step) {
    var tiplate = tiplates[step.action.type];
    var tooltipContent = '<div class="sttip"><div class="tooltip in"><div class="tooltip-arrow"></div><div class="tooltip-arrow second-arrow"></div><div class="popover-inner"></div>' + tiplate + '</div></div></div>';

    var el = document.createElement('div');
    // TODO: Improve styling for tooltip positioning
    el.setAttribute("style", "display: inline-block; position: absolute;");
    el.innerHTML = tooltipContent;

    tooltipEl = el.querySelector('.tooltip');
    tooltipEl.classList.add(...step.action.classes.split(" "));
    tooltipEl.classList.add(step.action.placement);

    el.querySelector('[data-iridize-role="stepCount"]').append(step.action.stepOrdinal);
    el.querySelector('[data-iridize-role="stepsCount"]').append(guideSteps.length);
    el.querySelector('[data-iridize-id="content"]').innerHTML = step.action.contents["#content"];

    return el
}


initGuidedLearning();

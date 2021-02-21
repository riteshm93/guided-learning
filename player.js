var guideSteps = [];
var tiplates = {};
var timerId;


/**
 * Init guided learning for current website
 * 
 * Make Jquery available to current website, Jquery is required for performing various action for dom manipulation to show guide steps.
 * Make default Stylesheet for guide available to current website.
 * Finally get guided steps data and use callback to process guide data and start guided learning on current website.  
*/
function initGuidedLearning() {
    var guidedLearningCssLink = document.createElement("link");
    guidedLearningCssLink.rel = "stylesheet";
    guidedLearningCssLink.href = "https://guidedlearning.oracle.com/player/latest/static/css/stTip.css";
    document.body.appendChild(guidedLearningCssLink);

    var jqueryScript = document.createElement("script");
    jqueryScript.src = "https://code.jquery.com/jquery-3.5.1.min.js";
    document.body.appendChild(jqueryScript);
    jqueryScript.onload = () => {
        var guideDataScript = document.createElement("script");
        guideDataScript.src = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=processGuideData&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867";
        document.body.appendChild(guideDataScript);
    };
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
 * @param {Boolean}     [useTimer=false] optional boolean flag to use timer to auto move to next step
*/
function addTooltip(stepId, useTimer=false) {
    clearTimeout(timerId); // Clear any existing timer for showing next steps

    step = guideSteps.filter(step => step.id === stepId)[0];

    if (!step) {
        // TODO: (Enhancement) Ideally this should not happen, capture error using sentry or some other tool for such cases
        alert("Invalid step");
        return;
    }

    if (step.action.type == "closeScenario") {
        jQuery(".sttip").remove();
        return;
    }

    stepTooltip = generateTooltip(step, tiplates);

    stepSelector = jQuery(step.action.selector);
    if (stepSelector) {
        if (step.action.onlyOneTip) { // Remove previous tooltip if only one tip is allowed
            jQuery(".sttip").remove();
        }

        if (!getTooltipElement(step.id)) { // Check and add tooltip if not already present when multiple tip are allowed.
            stepSelector.after(stepTooltip);
            addTooltipEventHandlers(step);
        }

        // Enhancement: automated flow for next steps based on watchSelector and warningTimeout values
        if (useTimer && step.action.watchSelector) {
            timerId = setTimeout( () => { addTooltip(step.followers[0].next, useTimer); }, step.action.warningTimeout);
        }
    }
}


/**
 * Get tooltip element for a step id.
 *
 * @param {String}      stepId
 *
 * @returns {Object}    tooltip element
*/
function getTooltipElement(stepId) {
    return document.querySelector('[gguided-learning-step-id="' + stepId + '"]');
}


/**
 * Add event handlers for tooltip button clicks.
 *
 * clicking next call addTooltip for next step.
 * clicking previous call addTooltip for previous step.
 * clicking close clears all tooltip data.
 *
 * @param {Object}      step
*/
function addTooltipEventHandlers(step) {
    guideTooltipEl = getTooltipElement(step.id);
    guideTooltipEl.querySelector('[data-iridize-role="prevBt"]').onclick = () => {
        previousStep = guideSteps.filter(s => (s.followers[0] || {})["next"] === step.id)[0];
        if (previousStep) {
            addTooltip(previousStep.id);
        }
        // Reached first step of the guide
        else if (confirm("You have reached the beginning of the guide\nClick OK to close the guide.\nClick Cancel to watch guide again.")) {
            jQuery(".sttip").remove();
        }
    }

    guideTooltipEl.querySelector('[data-iridize-role="nextBt"]').onclick = () => {
        addTooltip(step.followers[0].next);
    }

    guideTooltipEl.querySelector('[data-iridize-role="closeBt"]').onclick = () => {
        jQuery(".sttip").remove();
    }
}

/**
 * Generate tooltip data for given step.
 *
 * Uses step data in default template and tiplate to generate tooltip HTML data.
 * Also add class based on step classes and placement data.
 *
 * @param {Object}      step
 * @param {Object}      tiplates
 *
 * @returns {String}    tooltip data for given step
*/
function generateTooltip(step, tiplates) {
    var tiplate = tiplates[step.action.type];
    var tooltipContent = '<div class="tooltip in"><div class="tooltip-arrow"></div><div class="tooltip-arrow second-arrow"></div><div class="popover-inner"></div>' + tiplate + '</div></div>';

    var el = document.createElement('div');
    el.setAttribute("class", "sttip");
    el.setAttribute("gguided-learning-step-id", step.id);
    // TODO: Improve styling for tooltip positioning
    el.setAttribute("style", "display: inline-block; position: absolute;");
    el.innerHTML = tooltipContent;

    tooltipEl = el.querySelector('.tooltip');
    tooltipEl.classList.add(...step.action.classes.split(" "));
    tooltipEl.classList.add(step.action.placement);
    tooltipEl.setAttribute("style", "background: white;");

    el.querySelector('[data-iridize-role="stepCount"]').append(step.action.stepOrdinal);
    el.querySelector('[data-iridize-role="stepsCount"]').append(guideSteps.length);
    el.querySelector('[data-iridize-id="content"]').innerHTML = step.action.contents["#content"];

    for (roleButton in step.action.roleTexts) {
        el.querySelector('[data-iridize-role="'+roleButton+'"]').innerText = step.action.roleTexts[roleButton]
    }

    return el
}

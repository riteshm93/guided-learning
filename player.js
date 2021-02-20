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
*/
function processGuideData(guideDataResponse) {
    console.log(guideDataResponse);
}


initGuidedLearning();

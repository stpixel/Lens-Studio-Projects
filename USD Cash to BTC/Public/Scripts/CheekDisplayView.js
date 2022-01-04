// CheekDisplayView.js
// Version: 1.0.0
// Event: OnAwake
// Description: The cheek view shows up or down arrows on the cheek depending on whether the specified cryptocurrency is up or down in the last 24h


// @input Component.Image left
// @input Component.Image right
// @input Asset.Texture upImage
// @input Asset.Texture downImage

/**
 * Takes a result from the FTX API and displays it
 */
var displayResult = function(result) {
    if (result.changeBod > 0) {
        script.left.mainPass.baseTex = script.upImage;
        script.right.mainPass.baseTex = script.upImage;
    } else {
        script.left.mainPass.baseTex = script.downImage;
        script.right.mainPass.baseTex = script.downImage;
    }
};

/**
 * Hides the cheek display
 */
var hideDisplay = function() {
    script.left.mainPass.baseColor = new vec4(1, 1, 1, 0);
    script.right.mainPass.baseColor = new vec4(1, 1, 1, 0);
};

/**
 * Fades the cheek display out when the controller is loading
 */
var enableLoading = function() {
    global.tweenManager.startTween(script.left.getSceneObject(), "fadeOut");
    global.tweenManager.startTween(script.right.getSceneObject(), "fadeOut");

};

/**
 * Fades the cheek display in when the controller is done loading
 */
var disableLoading = function() {
    global.tweenManager.startTween(script.left.getSceneObject(), "fadeIn");
    global.tweenManager.startTween(script.right.getSceneObject(), "fadeIn");
};

script.api.displayResult = displayResult;
script.api.hideDisplay = hideDisplay;
script.api.enableLoading = enableLoading;
script.api.disableLoading = disableLoading;

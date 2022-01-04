// MainDisplayView.js
// Version: 1.0.0
// Event: OnAwake
// Description: The main view shows information about the specified cryptocurrency market above the users head including its icon, its ticker, whether its up or down, its price and the percentage change

// @input Component.Text currencyDisplay
// @input Component.Text priceDisplay
// @input Component.Text directionDisplay
// @input vec4 directionUpColor = {0,0,1,1} {"widget":"color"}
// @input vec4 directionDownColor = {1,0,0,1} {"widget":"color"}
// @input Component.Head headTrackingCenter
// @input Asset.Texture btcIcon
// @input Asset.Texture ethIcon
// @input Asset.Texture dogeIcon
// @input Component.Image currencyIconDisplay
// @input SceneObject loadingDisplay

// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
var formatPrice = function(price) {
    return (price).toFixed(price < 1.0 ? 4 : 2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

/**
 * @param {Number} price Price of the asset in USD as a Number
 * @param {Number} percentChange the 24h percent change, in decimal form, of the asset
 * This sets the price display to reflect the price and percent change
 */
var setPriceDisplay = function(price, percentChange) {
    script.priceDisplay.text = "$" + formatPrice(price) + " | " + (percentChange * 100).toFixed(1) + "%";
};

/**
 * @param {String} currencyTicker the currency ticker symbol for the currency you wish to display
 * Set the currency ticker display to the input currencyTicker
 */
var setCurrencyDisplay = function(currencyTicker) {
    script.currencyDisplay.text = currencyTicker + " IS ";
};

/**
 * @param {Number} percentChange the signed percent change of the currency to decide if the change is positive or negative
 * Sets the direction indicator based on the percent change being positive or negative
 */
var setDirectionDisplay = function(percentChange) {
    var currAlpha = script.directionDisplay.textFill.color.a;
    if (percentChange > 0) {
        script.directionDisplay.text = " UP!";
        script.directionDisplay.textFill.color = new vec4(script.directionUpColor.r, script.directionUpColor.g, script.directionUpColor.b, currAlpha);
    } else if (percentChange < 0) {
        script.directionDisplay.text = " DOWN!";
        script.directionDisplay.textFill.color = new vec4(script.directionDownColor.r, script.directionDownColor.g, script.directionDownColor.b, currAlpha);
    }
};

/**
 * @param {String} currencyTicker the currency ticker symbol for the icon you wish to display
 * Sets the currency icon based on the input ticker
 */
var setCurrencyIconDisplay = function(currencyTicker) {
    switch (currencyTicker) {
        case "BTC":
            script.currencyIconDisplay.mainPass.baseTex = script.btcIcon;
            break;
        case "ETH":
            script.currencyIconDisplay.mainPass.baseTex = script.ethIcon;
            break;
        case "DOGE":
            script.currencyIconDisplay.mainPass.baseTex = script.dogeIcon;
            break;
    }
        
};

/**
 * The text for currency and direction displays ("BTC IS UP!") are seperate text components due to having different colors.
 * This method centers them to the head manually
*/
var centerCurrencyAndDirectionDisplays = function() {
    var currencyDisplayTransform = script.currencyDisplay.getTransform();
    var directionDisplayTransform = script.directionDisplay.getTransform();    
    
    var currencyLocalToWorld = currencyDisplayTransform.getWorldTransform();
    var directionLocalToWorld = directionDisplayTransform.getWorldTransform();
    
    // Get the left side of the box we need to center
    var currencyBoundingBoxMin = script.currencyDisplay.localAabbMin();
    var leftSide = currencyLocalToWorld.multiplyPoint(new vec3(currencyBoundingBoxMin.x, 0, 0));
    // Get the right side of the box we need to center
    var directionBoundingBoxMax = script.directionDisplay.localAabbMax();
    var rightSide = directionLocalToWorld.multiplyPoint(new vec3(directionBoundingBoxMax.x, 0, 0));
    var fromLeftToRight = rightSide.sub(leftSide);
    // Center point of the box we want to center
    var centerPoint = leftSide.add(fromLeftToRight.normalize().uniformScale(fromLeftToRight.length / 2.0));
    // Offset from the target center point (the center of the head) to the current center point
    var offset = script.headTrackingCenter.getTransform().getWorldPosition().sub(centerPoint);
    
    // Move the boxes we wish to center by the offset
    currencyDisplayTransform.setWorldPosition(currencyDisplayTransform.getWorldPosition().add(new vec3(offset.x, 0, 0)));
    directionDisplayTransform.setWorldPosition(directionDisplayTransform.getWorldPosition().add(new vec3(offset.x, 0, 0)));
};

/**
 * Hides all displays (currency, direction, price) except the icon since this view keeps that on at all times
*/
var hideDisplay = function() {
    script.currencyDisplay.textFill.color = new vec4(script.currencyDisplay.textFill.color.r, script.currencyDisplay.textFill.color.g, script.currencyDisplay.textFill.color.b, 0);
    script.directionDisplay.textFill.color = new vec4(script.directionDisplay.textFill.color.r, script.directionDisplay.textFill.color.g, script.directionDisplay.textFill.color.b, 0);
    script.priceDisplay.textFill.color = new vec4(script.priceDisplay.textFill.color.r, script.priceDisplay.textFill.color.g, script.priceDisplay.textFill.color.b, 0);
};

/**
 * Enables the loading fade in/out tweens on all the displays
 */
var enableLoading = function() {
    script.loadingDisplay.enabled = true;
    
    var tweenTargets = [script.currencyDisplay.getSceneObject(), script.directionDisplay.getSceneObject(), script.priceDisplay.getSceneObject(), script.loadingDisplay];
    var prevTweenNames = ["fadeIn", "fadeIn", "fadeIn", "fadeOut"];    
    var currTweenNames = ["fadeOut", "fadeOut", "fadeOut", "fadeIn"];
    for (var i = 0; i < tweenTargets.length; i++) {
        global.tweenManager.stopTween(tweenTargets[i], prevTweenNames[i]);
        global.tweenManager.stopTween(tweenTargets[i], currTweenNames[i]);
        global.tweenManager.startTween(tweenTargets[i], currTweenNames[i]);
    }
};

/**
 * Disables the loading fade in/out tweens on all the displays
 */
var disableLoading = function() {
    centerCurrencyAndDirectionDisplays();
    var tweenTargets = [script.currencyDisplay.getSceneObject(), script.directionDisplay.getSceneObject(), script.priceDisplay.getSceneObject(), script.loadingDisplay];
    var prevTweenNames = ["fadeOut", "fadeOut", "fadeOut", "fadeIn"];
    var currTweenNames = ["fadeIn", "fadeIn", "fadeIn", "fadeOut"];  
    var cbs = [null, null, null, function() {
        script.loadingDisplay.enabled = false;
    }];
    for (var i = 0; i < tweenTargets.length; i++) {
        global.tweenManager.stopTween(tweenTargets[i], prevTweenNames[i]);
        global.tweenManager.stopTween(tweenTargets[i], currTweenNames[i]);
        global.tweenManager.startTween(tweenTargets[i], currTweenNames[i], cbs[i]);
    }
};

/**
 * Takes a result from the FTX API and displays it
 */
var displayResult = function(result) {
    setPriceDisplay(result.price, result.changeBod);
    setDirectionDisplay(result.changeBod);
    setCurrencyDisplay(result.baseCurrency);
};

/**
 * Sets the current currency of this view
 */
var setCurrency = function(currencyTicker) {
    setCurrencyIconDisplay(currencyTicker);
};

script.api.setCurrency = setCurrency;
script.api.displayResult = displayResult;
script.api.enableLoading = enableLoading;
script.api.disableLoading = disableLoading;
script.api.hideDisplay = hideDisplay;

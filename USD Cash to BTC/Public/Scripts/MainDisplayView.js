// MainDisplayView.js
// Version: 1.0.0
// Event: OnAwake
// Description: The main view shows information about the specified cryptocurrency market above the users head including its icon, its ticker, whether its up or down, its price and the percentage change



// @input Component.Text one
// @input Component.Text two
// @input Component.Text five
// @input Component.Text ten
// @input Component.Text twenty
// @input Component.Text fifty
// @input Component.Text hundred

var ticker = "";

var formatPrice = function(price) {
    return (price);
};


var setPriceDisplay = function(price, percentChange) {
    script.priceDisplay.text = "$" + formatPrice(price) + " | " + (percentChange * 100).toFixed(1) + "%"; 
};

var setPriceDisplay = function(price, percentChange) {
    script.one.text = (1/price).toFixed(5) + " " + ticker;
    script.two.text = (2/price).toFixed(5) + " " + ticker;
    script.five.text = (5/price).toFixed(5) + " " + ticker;
    script.ten.text = (10/price).toFixed(5) + " " + ticker;
    script.twenty.text = (20/price).toFixed(5) + " " + ticker;
    script.fifty.text = (50/price).toFixed(5) + " " + ticker;
    script.hundred.text = (100/price).toFixed(5) + " " + ticker;
};


var setCurrencyDisplay = function(currencyTicker) {

    ticker = currencyTicker;
};

var displayResult = function(result) {
    setPriceDisplay(result.price, result.changeBod);

    setCurrencyDisplay(result.baseCurrency);
};

var setCurrency = function(currencyTicker) {
    setCurrencyIconDisplay(currencyTicker);
};

script.api.displayResult = displayResult;
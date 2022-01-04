// DisplayController.js
// Version: 1.0.0
// Event: OnAwake
// Description: The display controller subscribes to button events from the UI, calls the FTX API and then populates views with the resulting data

/*

                                                            ┌─────────┐
                                                            │         │
                                                      ┌────►│  View 1 │
                                                      │     │         │
┌─────────────┐          ┌──────────────────────┐     │     └─────────┘
│             │ Currency │                      │     │
│  UI Button  ├─────────►│   DisplayController  ├─────┤     ┌─────────┐
│             │          │                      │     │     │         │
└─────────────┘          └──────────────────────┘     ├────►│  View 2 │
                                                      │     │         │
                                                      │     └─────────┘
                                                      │         ...
                                                      │     ┌─────────┐
                                                      │     │         │
                                                      └────►│  View N │
                                                            │         │
                                                            └─────────┘

A view can implement the following functions, it does not have to implement all.

setCurrency(currencyTicker) -> Called when a button for a new currency is pressed
displayResult(result) -> Called after the API returns results for a Source / Destination currency pair
enableLoading() -> Called while the API network request is occuring
disableLoading() -> Called once the API network request has returned
hideDisplay() -> Called at lens start
*/

// The current currency selected
var currCurrency;
// The current event used to poll the api
var currDisplayEvent;

// @input Component.ScriptComponent ftxAPI
// @input Component.ScriptComponent[] displays
// @input float pollFrequencySecs = 0.5

/**
 * @param {String} sourceCurrencyTicker The source currency/market symbol to convert
 * @param {String} destinationCurrencyTicker The destination currency/market symbol to convert into
 * @param {boolean} showLoading should the controller have views show loading UI.
 */
var displayCurrency = function(sourceCurrencyTicker, destinationCurrencyTicker, showLoading) {
    script.displays.forEach(function(display) {
        if (display && display.api.setCurrency) {
            display.api.setCurrency(sourceCurrencyTicker);
        }
    });
    
    if (showLoading) {
        script.displays.forEach(function(display) {
            if (display && display.api.enableLoading) {
                display.api.enableLoading();
            }
        });
    }
    script.ftxAPI.api.getMarket(sourceCurrencyTicker, destinationCurrencyTicker, function(err, parsedBody) {        
        // Rapid changing of the currency may mean the API response for the wrong currency returns, check that the returned currency is the current currency before updating the UI
        if (!err && parsedBody.success && currCurrency === sourceCurrencyTicker) {
            var result = parsedBody.result;
            script.displays.forEach(function(display) {
                if (display && display.api.displayResult) {
                    display.api.displayResult(result);
                }
            });
            if (showLoading) {
                // Wait a frame to end the loading
                var delayedEvent = script.createEvent("DelayedCallbackEvent");
                delayedEvent.bind(function() {
                    script.displays.forEach(function(display) {
                        if (display && display.api.disableLoading) {
                            display.api.disableLoading();
                        }
                    });
                });
                delayedEvent.reset(0);
            }
        }
    });
};


// Polls the displayCurrency function for a given source/destination ticker pair so that the display can live update
var pollDisplayCurrency = function(sourceCurrencyTicker, destinationCurrencyTicker) {
    if (currDisplayEvent) {
        currDisplayEvent.enabled = false;
    }
    currDisplayEvent = script.createEvent("DelayedCallbackEvent");
    currDisplayEvent.bind(function() {
        displayCurrency(sourceCurrencyTicker, destinationCurrencyTicker);
        currDisplayEvent.reset(script.pollFrequencySecs);
    });
    currDisplayEvent.reset(script.pollFrequencySecs);
};

var displayBitcoin = function() {
    currCurrency = "BTC";
    displayCurrency("BTC", "USD", true);
    pollDisplayCurrency("BTC", "USD");
};

var displayEthereum = function() {
    currCurrency = "ETH";
    displayCurrency("ETH", "USD", true);
    pollDisplayCurrency("ETH", "USD");
};

var displayDogecoin = function() {
    currCurrency = "DOGE";
    displayCurrency("DOGE", "USD", true);
    pollDisplayCurrency("DOGE", "USD");
};

var init = function() {
    if (!script.ftxAPI) {
        print("ERROR: No FTX API Script component found");
    }
    
    
    script.displays.forEach(function(display) {
        if (display && display.api.hideDisplay) {
            display.api.hideDisplay();
        }
    });
    displayBitcoin();  
};

var startEvent = script.createEvent("OnStartEvent");
startEvent.bind(init);

script.api.displayBitcoin = displayBitcoin;
script.api.displayEthereum = displayEthereum;
script.api.displayDogecoin = displayDogecoin;

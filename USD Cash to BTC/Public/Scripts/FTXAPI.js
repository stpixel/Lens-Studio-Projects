// FTXAPI.js
// Version: 1.0.0
// Description: This script is used to issue API requests to the FTX API using the remote service module.

// @input Asset.RemoteServiceModule remoteServiceModule

function handleAPIResponse(response, cb) {
    if (response.statusCode !== 1) {
        print("ERROR: The API call did not succeed!. Please check your request");
        cb(true);
    } else {
        try {
            var parsedBody = JSON.parse(response.body);
            if (cb) {
                cb(false, parsedBody);
            }
        } catch (e) {
            print("ERROR: Failed to parse response");
            if (cb) {
                cb(true);
            }
        }
    }
}

// https://docs.ftx.us/#get-single-market
function getMarket(symbol1, symbol2, cb) {
    var req = global.RemoteApiRequest.create();
    req.endpoint = "get_single_market";
    req.parameters = {"symbol1" : symbol1, "symbol2": symbol2};
    script.remoteServiceModule.performApiRequest(req, 
        function(response) {
            handleAPIResponse(response, cb);
        });
}

// https://docs.ftx.us/#get-markets
function getMarkets(cb) {
    var req = global.RemoteApiRequest.create();
    req.endpoint = "get_markets";
    script.remoteServiceModule.performApiRequest(req, 
        function(response) {
            handleAPIResponse(response, cb);
        });
}

// https://docs.ftx.us/#get-historical-prices
function getCandles(symbol1, symbol2, resolution, start_time, end_time, cb) {
    var req = global.RemoteApiRequest.create();
    req.endpoint = "get_candles";
    req.parameters = {"symbol1" : symbol1, "symbol2": symbol2, "resolution": resolution, "start_time": start_time, "end_time": end_time};
    script.remoteServiceModule.performApiRequest(req, 
        function(response) {
            handleAPIResponse(response, cb);
        });
}

script.api.getMarket = getMarket;
script.api.getMarkets = getMarkets;
script.api.getCandles = getCandles;
var secret=process.env.secret
var key=process.env.key

var thestopsize = 10 // $


const ccxt = require('ccxt')
var buyTps = []
var sellTps = []
var market = 'BTC/USDT'
var amount
var         type
var         stopsize //$
var         interval = 1
var        running = false
var         stoploss
var client = new ccxt.binance({
    "apiKey": key,
    "secret": secret,
    "options": {
        "defaultMarket": "futures"
    },
    'enableRateLimit': true,
    'urls': {
        'api': {
            'public': 'https://fapi.binance.com/fapi/v1',
            'private': 'https://fapi.binance.com/fapi/v1',
        },
    }

})
var orders = []
var tradesArr = []
var trades


setInterval(async function(){
    
trades = await client.fapiPrivateGetUserTrades({
            'symbol': 'BTCUSDT',
            'limit': 1000
        })
        for (var t in trades) {
            if (!tradesArr.includes(trades[t].id)){
            var go = true

            for (var o in orders){
if (parseFloat(orders[o]) == parseFloat(trades[t].orderId)) {
    go = false;
}
            }
            if (go){
            tradesArr.push(trades[t].id)

if (trades[t].side == 'SELL'){
        market = 'BTC/USDT'
        amount = parseFloat(trades[t].qty)
        type = 'sell'
        stopsize = thestopsize
        interval = 1
        running = true
        stoploss = await initialize_stop()

print_status()
}
else {
    amount = parseFloat(trades[t].qty)
        
        market = 'BTC/USDT'
        type = 'buy'
        stopsize = thestopsize
        interval = 1
        running = true
        stoploss = await initialize_stop()
print_status()
}
}
        }
        }
}, 5000);
setTimeout(async function(){

    
trades = await client.fapiPrivateGetUserTrades({
            'symbol': 'BTCUSDT',
            'limit': 1000
        })
        for (var t in trades) {
            if (!tradesArr.includes(trades[t].id)){
                tradesArr.push(trades[t].id)
            }
        }
}, 50)
    async function initialize_stop(){
        if (type == "sell") { 
        p = await client.fetchTicker(market)
        p = p.last
        p = p + stopsize
        return p }
        else{ 
        p = await client.fetchTicker(market)
        p = p.last
        p = p - stopsize
        return p }
    }
    async function update_stop(){
        if (running){
        price = (await client.fetchTicker(market)).last
        if (type == "buy"){
            if ((price - stopsize) > stoploss){
                stoploss = price - stopsize
                console.log("New high observed: Updating stop loss to " + stoploss.toPrecision(6))
            }
            else if (price <= stoploss){
                running = false
                price = (await client.fetchTicker(market)).last
                var o = client.createOrder('BTC/USDT', "Market", 'sell', amount)
                orders.push(o.id)
                console.log("Sell triggered | Price: " + price.toPrecision(6) +" | Stop loss: " + stoploss.toPrecision(6))
                }

            }
        else if (type == "sell"){
            if ((price + stopsize) < stoploss){
                stoploss = price + stopsize
                console.log("New low observed: Updating stop loss to "  + stoploss.toPrecision(6))
            }
            else if (price >= stoploss){
                running = false
                price = (await client.fetchTicker(market)).last
                var o = client.createOrder('BTC/USDT', "Market", 'buy', amount)
                orders.push(o.id)

                console.log("Buy triggered | Price: " + price.toPrecision(6) + " | Stop loss: " + stoploss.toPrecision(6))
            }
        }
            if (running){
    setTimeout(function(){
        print_status()
    }, 1000 * interval)
}
}
        }
    async function print_status(){
        last = (await client.fetchTicker(market)).last
        console.log("---------------------")
        console.log("Order type: " + type)
        console.log("Market: " + market)
        console.log("Stop loss: " + stoploss)
        console.log("Last price: " + last)
        console.log("Stop size: " + stopsize)
        console.log("---------------------")
if (running){
    setTimeout(function(){
        update_stop()
    }, 1000 * interval)
}
}
            
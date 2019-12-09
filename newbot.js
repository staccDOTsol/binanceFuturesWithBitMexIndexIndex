var secret=process.env.secret
var key=process.env.key
var dollars = 5
const ccxt = require('ccxt')
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
setTimeout(async function(){
   trades = await client.fapiPrivateGetUserTrades({
            'symbol': 'BTCUSDT',
            'limit': 1000
        })
        for (var t in trades) {
            console.log(trades[t])
            tradesArr.push(trades[t].id)
        }
setInterval(async function(){
trades = await client.fapiPrivateGetUserTrades({
            'symbol': 'BTCUSDT',
            'limit': 1000
        })
        for (var t in trades) {
            if (!tradesArr.includes(trades[t].id)){
            var go = true

            for (var o in orders){
if (orders[o] == trades[t].orderId){
    go = false;
}
            }
            if (go){
            tradesArr.push(trades[t].id)
qty = parseFloat(trades[t].qty)
price = parseFloat(trades[t].price)
if (trades[t].side == 'SELL'){
var o = await client.createOrder('BTC/USDT', "Limit", 'buy', qty, price - dollars)
orders.push(parseFloat(o.id))
console.log(orders)
}
else {
    var o = await client.createOrder('BTC/USDT', "Limit", 'sell', qty, price + dollars)
    orders.push(parseFloat(o.id))
    console.log(orders)
}
}
        }
        }
}, 2000);
}, 1000)
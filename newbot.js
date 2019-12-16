var secret=process.env.secret
var key=process.env.key
var dollars = 50
const ccxt = require('ccxt')
var buyTps = []
var sellTps = []
var trailingTp = 0.2 // %
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
    try{
ticker = await client.fetchTicker('BTC/USDT')

llast = last
last = ticker.last
}
catch(err){

    console.log(err)
}

for (var tp in buyTps){
    console.log('last: ' + last)
    console.log('llast: ' + llast)
    if (llast < last){
        diff = last / llast
        buyTps[tp].price = parseFloat(buyTps[tp].price) * diff
    console.log('last: ' + last)
    console.log('llast: ' + last)
    console.log('diff: ' + diff)
    console.log('buytpstpprice: ' + buyTps[tp].price)
    } else{
        if (buyTps[tp].price > last){
            console.log('exit buy tp, price: ' + last + ' and buyTp price: ' + buyTps[tp].price)
            var o = await client.createOrder('BTC/USDT', "Limit", 'sell', buyTps[tp].qty, buyTps[tp].price - 100)
orders.push(parseFloat(o.id))
            buyTps.splice(buyTps[tp], 1)
        }
    }
}
for (var tp in sellTps){

    if (llast > last){
        diff = last / llast
        sellTps[tp].price = sellTps[tp].price * diff
    } else{
        if (sellTps[tp].price < last){
            console.log('exit sell tp, price: ' + last + ' and sellTps price: ' + sellTps[tp].price)
            var o = await client.createOrder('BTC/USDT', "Limit", 'buy', sellTps[tp].qty, sellTps[tp].price + 100)
orders.push(parseFloat(o.id))
            sellTps.splice(sellTps[tp], 1)
        }
    }
}

}, 5000)
var last
var llast
setTimeout(async function(){

   trades = await client.fapiPrivateGetUserTrades({
            'symbol': 'BTCUSDT',
            'limit': 1000
        })
        for (var t in trades) {
           // console.log(trades[t])
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

if (trades[t].side == 'SELL'){
sellTps.push({qty: parseFloat(trades[t].qty), price: parseFloat(trades[t].price) * (1 + (trailingTp / 100))})
}
else {
buyTps.push({qty: parseFloat(trades[t].qty), price: parseFloat(trades[t].price) * (1 - (trailingTp / 100))})

}
}
        }
        }
}, 2000);
}, 1000)
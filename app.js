var WebSocket = require('bitmex-realtime-api');
const ccxt = require('ccxt')
var client = new ccxt.binance(
            {"apiKey": "z4GiNxIiJRCxfTtbKqcSgSXcbNJqLKW5qNRarj6K9PeGzXoAKChot0UesyUwhCaI",
            "secret": "vW57vcFOSeA1yrdSonds31QF7LHnnBDg763LnCHOQWMalPjX2mvudvKqTqWL6pmz",
            "options":{"defaultMarket":"futures"},
            'urls': {'api': {
                                     'public': 'https://fapi.binance.com/fapi/v1',
                                     'private': 'https://fapi.binance.com/fapi/v1',},}
 })
var account;
var LB;
var HA;
var bal_usd;
var usd_init;
var bal_btc;
cancelall()
async function cancelallbyorderstatus(){
	ords        = await client.fetchOpenOrders( 'BTC/USDT' )

        for (var order in ords){
            oid = ords[order] ['info'] ['orderId']
            side = ords[order]['side']
for (var o in openorders){
            if (parseFloat(oid) == parseFloat(openorders[o].id)){
            //if (buysell == 1 && side == 'buy'){
            try{
                await client.cancelOrder( oid , 'BTC/USDT' )
            }
            catch (e){
                console.log(e)
            
            }
        }
        }
        //}
       /* else if (buysell = 0 && side == 'sell'){
        	try{
                await client.cancelOrder( oid , 'BTC/USDT' )
            }
            catch (e){
                console.log(e)
            
            }
        }*/
        }
    }
async function cancelall(){
	ords        = await client.fetchOpenOrders( 'BTC/USDT' )

        for (var order in ords){
            oid = ords[order] ['info'] ['orderId']
            side = ords[order]['side']
            //if (buysell == 1 && side == 'buy'){
            try{
                await client.cancelOrder( oid , 'BTC/USDT' )
            }
            catch (e){
                console.log(e)
            
            }
        //}
       /* else if (buysell = 0 && side == 'sell'){
        	try{
                await client.cancelOrder( oid , 'BTC/USDT' )
            }
            catch (e){
                console.log(e)
            
            }
        }*/
        }
    }
        var initial_bal;
first = true;
setInterval(async function(){
	
account         = await client.fetchBalance()
//console.log(account)
ticker = await client.fetchTicker( 'BTC/USDT' )
LB           = ticker.last + 0.5
//console.log(await client.fetchTicker( 'BTC/USDT' ))
HA= ticker.last - 0.5
bal_btc         = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ]) / HA 
bal_usd = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ])
if (first){
	//await client.loadProducts () 
	first = false;
	usd_init = bal_usd;
	initial_bal = bal_btc;
}
console.log(' ')
console.log('-----')
console.log(new Date())
console.log('bal btc: ' + bal_btc)
console.log('pnl btc: % ' + -1 * (1-bal_btc/initial_bal) * 100)
console.log('bal usd: ' + bal_usd)
console.log('pnl usd: % ' + -1 * (1-bal_usd/usd_init) * 100)
console.log('RSI: ' + theRSI[0])
console.log('diff: ' + diff)
cancelallbyorderstatus()
}, 60000)

const RSI = require('technicalindicators').RSI;
var rsis = []
var rsiover = false;
var rsibelow = false;
var a = 0
var buysell = -1
var theRSI = []
setInterval(async function(){
	if (rsis[a] == undefined){
		rsis[a] = []
	}
rsis[a].push(price)

if (rsis[a].length > 60){
	rsis[a].shift()
}
theRSI = RSI.calculate({period : 14, values : rsis[a]});
if (theRSI[0] > 73){
	rsiover = true;
}
else {
	rsiover = false;
}
if (theRSI[0] < 27){
	rsibelow = true;
}
else {
	rsibelow = false;
}
a++
if (a == 30){
	a = 0;
}
//console.log(theRSI[0])
}, 1000);

var ws = new WebSocket();
var above = 0;
var price = 0;
var index = 0;
var buying = 0;
var selling = 0;
var diff;
var openorders = []
setInterval(async function(){
	var trades = await client.fapiPrivateGetUserTrades({'symbol':'BTCUSDT', 'limit': 1000})
	for(var t in trades){
		for (var o in openorders){
			if (parseFloat(openorders[o]['id']) == parseFloat(trades[t].orderId)){
				openorders.indexOf(openorders[o]) !== -1 && openorders.splice(openorders.indexOf(openorders[o]), 1)
				console.log(' ')
				console.log('enter tp!')
				console.log(' ')
				console.log(openorders)
				if (trades[t].side == 'SELL'){
await client.createOrder(  'BTC/USDT', "Limit", 'buy', parseFloat(trades[t].qty), parseFloat(trades[t].price) * 0.995)
				}
				else {
await client.createOrder(  'BTC/USDT', "Limit", 'sell', parseFloat(trades[t].qty), parseFloat(trades[t].price) * 1.005)
				}
			}
		}
	}
	//console.log(await client.createOrder(  'BTC/USDT', "Limit", 'sell', 0.001, 8633))
}, 30000)
async function doit(){
	if (price > index){
		above = 1;
	}
	else {
		above = 0;
	}
	diff = price / index; 
	diff = -1 * (1-diff) * 100 
	if(diff < -0.04 && rsiover){
		if (selling == 0){
			//selling = 1;
			buysell = 0;
			//buying = 0;
			prc = HA
			qtybtc  = bal_btc * 125 / 50
			qty = Math.floor( prc * qtybtc / 10 )   / HA    
			openorders.push(await client.createOrder(  'BTC/USDT', "Limit", 'sell', qty, prc))
			console.log(new Date() + ': diff: ' + diff + ' RSI: ' + theRSI[0] + ' sell!') //ask
		}
	}

	else if (diff > 0.04 && diff < 100000 && rsibelow){
		if (buying == 0){
			//selling = 0;
			//buying = 1;
			buysell = 1;
			prc = LB
			qtybtc  = bal_btc * 125 / 50
			qty = Math.floor( prc * qtybtc / 10 )   / LB 
			openorders.push(await client.createOrder(  'BTC/USDT', "Limit", 'buy', qty, prc))
			console.log(new Date() + ': diff: ' + diff + ' RSI: ' + theRSI[0] + ' buy!') //bid
		}
	}
}
 ws.addStream('XBTUSD', 'instrument', async function (data, symbol, tableName) {
  price = (data[0].lastPrice)
  doit()
});

 ws.addStream('.BXBT', 'instrument', async function (data, symbol, tableName) {
  index=(data[0].lastPrice)
  doit()
});

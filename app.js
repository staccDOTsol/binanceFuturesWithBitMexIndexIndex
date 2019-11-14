var lowRSI = 27
var highRSI = 73
var minCross = 0.046


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
var client2 = new ccxt.binance({
             "options":{"defaultMarket":"futures"},
            'urls': {'api': {
                                     'public': 'https://fapi.binance.com/fapi/v1',
                                     'private': 'https://fapi.binance.com/fapi/v1',},}
} )//client.urls['api'] = client.urls['test']
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
            //	console.log('cancelling..')
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
        	if (true){
            oid = ords[order] ['info'] ['orderId']
            side = ords[order]['side']
            //if (buysell == 1 && side == 'buy'){
            //	console.log('cancelleing2...')
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
    }
        var initial_bal;
first = true;
var freePerc;
var position = 0;
setInterval(async function(){
	if (first){
	var trades = await client.fapiPrivateGetUserTrades({'symbol':'BTCUSDT', 'limit': 1000})
		for (var t in trades){
		tradesArr.push(trades[t].id)
}
ohlcv = await client2.fetchOHLCV ('BTC/USDT', timeframe = '1m', since = undefined, limit = 74, params = {})
		console.log(ohlcv)
		var c = 0;
				for (var candle in ohlcv){
		for (var b = ohlcv.length-1; b >= ohlcv.length-61; b--){
			if (rsis[c] == undefined){
				rsis[c] = []
			}
			rsis[c].push(ohlcv[candle][4])
			rsis[c].push(ohlcv[candle][4])
		if (rsis[c].length > 15){
			rsis[c].shift()
		}
		c++
		}
		c= 0
	}
		console.log(rsis[0])
		theRSI = RSI.calculate({period : 14, values : rsis[0]});
		console.log(theRSI[theRSI.length-1])
	}
pos = await client.fapiPrivateGetPositionRisk()
if (pos[0] != undefined){
position = parseFloat(pos[0]['positionAmt'])
}
//console.log(position)
account         = await client.fetchBalance()
ticker = await client.fetchTicker( 'BTC/USDT' )
LB           = ticker.last + 0.5
//console.log(await client.fetchTicker( 'BTC/USDT' ))
HA= ticker.last - 0.5
free_btc = parseFloat(account[ 'info' ] [ 'totalInitialMargin' ]) / HA

bal_btc         = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ]) / HA
freePerc = (free_btc / bal_btc)
bal_usd = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ])  
if (first){

	//await client.loadProducts () 
	first = false;
	usd_init = bal_usd;
	initial_bal = bal_btc;
}
if (count >= 4 * 6 * 1){
	count = 0;
console.log(' ')
console.log('-----')
console.log(new Date())
console.log('position: ' + position)
console.log('usedPerc: ' + freePerc)
console.log('bal btc: ' + bal_btc)
console.log('pnl btc: % ' + -1 * (1-bal_btc/initial_bal) * 100)
console.log('bal usd: ' + bal_usd)
console.log('pnl usd: % ' + -1 * (1-bal_usd/usd_init) * 100)
console.log('RSI: ' + theRSI[theRSI.length-1])
console.log('diff: ' + diff)
cancelall()
}
count++;
}, 2500)
var count = 0;
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

if (rsis[a].length > 15){
	rsis[a].shift()
}
theRSI = RSI.calculate({period : 14, values : rsis[a]});
if (theRSI[theRSI.length-1] > highRSI){
	rsiover = true;
}
else {
	rsiover = false;
}
if (theRSI[theRSI.length-1] < lowRSI){
	rsibelow = true;
}
else {
	rsibelow = false;
}
a++
if (a == 30){
	a = 0;
}
//console.log(theRSI[theRSI.length-1])
}, 1000);

var ws = new WebSocket();
var above = 0;
var price = 0;
var index = 0;
var buying = 0;
var selling = 0;
var diff;
var tps = []
var sls = []
var tradesArr= []
var openorders = []
setInterval(async function(){
	var split = false;
	for (var t in tps){
		if (tps[t].price <= price && tps[t].direction == 'sell'){
(await client.createOrder(  'BTC/USDT', "Limit", 'sell', tps[t].amt, tps[t].price + 100))

  			split = true
		}if (tps[t].price >= price && tps[t].direction == 'buy'){
(await client.createOrder(  'BTC/USDT', "Limit", 'buy', tps[t].amt, tps[t].price - 100))
	
split = true
		}
		

	}
	if (split){
		  			tps.indexOf(tps[t]) !== -1 && tps.splice(tps.indexOf(tps[t]), 1)
sls.splice(tps.indexOf(tps[t]), 1)

	}

	split = false;
	for (var t in sls){
		if (sls[t].price >= price && sls[t].direction == 'sell'){
(await client.createOrder(  'BTC/USDT', "Limit", 'sell', tps[t].amt, tps[t].price + 100))

  			split = true
		}if (sls[t].price <= price && sls[t].direction == 'buy'){
(await client.createOrder(  'BTC/USDT', "Limit", 'buy', tps[t].amt, tps[t].price - 100))

split = true
		}
		

	}
	if (split){
		  			sls.indexOf(sls[t]) !== -1 && sls.splice(sls.indexOf(sls[t]), 1)
tps.splice(sls.indexOf(sls[t]), 1)

	}
	var trades = await client.fapiPrivateGetUserTrades({'symbol':'BTCUSDT', 'limit': 1000})
			//console.log(trades)
	//console.log(tradesArr)
	for(var t in trades){
			if (!tradesArr.includes(trades[t].id)){
				tradesArr.push(trades[t].id)
	console.log(' ')
				console.log('enter tp!')
				console.log(' ')
				console.log(openorders)
				if (trades[t].side == 'SELL'){
					

					sls.push({'direction': 'buy','i': 'BTC/USDT',
  'amt': parseFloat(trades[t].qty),
 'price': parseFloat(trades[t].price)* 1.0045})

					tps.push({'direction': 'buy','i': 'BTC/USDT',
  'amt': parseFloat(trades[t].qty),
 'price': parseFloat(trades[t].price)* 0.945})

				}
				else {
sls.push({'direction': 'sell','i': 'BTC/USDT',
  'amt': parseFloat(trades[t].qty),
 'price': parseFloat(trades[t].price)* 0.965})

					tps.push({'direction': 'sell','i': 'BTC/USDT',
  'amt': parseFloat(trades[t].qty),
 'price': parseFloat(trades[t].price)* 1.0045})
}
			}
		}
	//console.log(await client.createOrder(  'BTC/USDT', "Limit", 'sell', 0.001, 8633))
}, 10000)
async function doit(){
	if (price > index){
		above = 1;
	}
	else {
		above = 0;
	}
	diff = price / index; 
	diff = -1 * (1-diff) * 100 
	if(diff < -1 * minCross / 1.5 && rsiover){
		if (selling == 0 && (freePerc < 0.8 || position > 0)){
			//selling = 1;
			buysell = 0;
			//buying = 0;
			prc = HA
			qtybtc  = bal_btc * 125 / 50
			qty = Math.floor( prc * qtybtc / 10 )   / HA    
			if (position > 0){
				qty = qty * 2
			}
	openorders.push(await client.createOrder(  'BTC/USDT', "Limit", 'sell', qty, prc))

				console.log(openorders)
			console.log(new Date() + ': diff: ' + diff + ' RSI: ' + theRSI[theRSI.length-1] + ' sell!') //ask
		}
	}

	else if (diff > minCross && diff < 100000 && rsibelow){
		if (buying == 0 && (freePerc < 0.8 || position < 0)){
			//selling = 0;
			//buying = 1;
			buysell = 1;
			prc = LB
			qtybtc  = bal_btc * 125 / 50
			qty = Math.floor( prc * qtybtc / 10 )   / LB 
			if (position < 0){
				qty = qty * 2
			}
openorders.push(await client.createOrder(  'BTC/USDT', "Limit", 'buy', qty, prc))

				console.log(openorders)

			console.log(new Date() + ': diff: ' + diff + ' RSI: ' + theRSI[theRSI.length-1] + ' buy!') //bid
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

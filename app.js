var lowRSI = 35
var highRSI = 65
var minCross = 0.03
var useMFI = true
var rsiTF = 5
var mfiTF = 15
var delaybetweenorder = 0.5 //sec
var takeProfit = 4.5 //%
var stopLoss = -6.5 //%
var min_withdrawal_percent = 0.025 // when bot profits 5%, withdraw 2.5%
var WebSocket = require('bitmex-realtime-api');
const ccxt = require('ccxt')
var client = new ccxt.binance(
            {"apiKey": "yUJluobNfQ5H1nQ9Cp3czdmHL27Wz8I61E1b7tsR2hMYApLCbPbeezvtQWj2D2NL",
            "secret": "v0BwW14iRs91eppXZYsrqUxYdYTxpWotJNPgpkcph6N3q9mmMOi23BlQrBwSBKZ4",
            "options":{"defaultMarket":"futures"},
            'urls': {'api': {
                                     'public': 'https://fapi.binance.com/fapi/v1',
                                     'private': 'https://fapi.binance.com/fapi/v1',},}
 })
const binance = require('node-binance-api')().options({
  APIKEY: 'yUJluobNfQ5H1nQ9Cp3czdmHL27Wz8I61E1b7tsR2hMYApLCbPbeezvtQWj2D2NL',
  APISECRET: 'v0BwW14iRs91eppXZYsrqUxYdYTxpWotJNPgpkcph6N3q9mmMOi23BlQrBwSBKZ4',
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

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
                await client2.cancelOrder( oid , 'BTC/USDT' )
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
ohlcv = await client2.fetchOHLCV ('BTC/USDT', timeframe = rsiTF.toString() + 'm', since = undefined, limit = 74, params = {})
		//console.log(ohlcv)
		var c = 0;
		for (var b in ohlcv){
					ohlcvs.push[ohlcv[b]]
			if (rsis[0] == undefined){
				rsis[0] = []
			}
			rsis[0].push(ohlcv[b][4])
		if (rsis[0].length > 70){
			rsis[0].shift()
		}
		}
	ohlcv = await client2.fetchOHLCV ('BTC/USDT', timeframe = mfiTF.toString() + 'm', since = undefined, limit = 74, params = {})
//console.log(ohlcv)
	high = []
	low = []
	close = []
	volume = []
	for (var o in ohlcvs){
		high.push(ohlcvs[o][2])
		low.push(ohlcvs[o][3])
		close.push(ohlcvs[o][4])
		volume.push(ohlcvs[o][5])
	}
		//console.log(rsis[0])
		//console.log(high)
theRSI = RSI.calculate({ rsiPeriod : 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3,values : rsis[0]});

		theMFI = MFI.calculate({period : 14, high: high, low:low, close: close, volume: volume});
		//console.log(theMFI[theMFI.length-1])
	}
pos = await client.fapiPrivateGetPositionRisk()
ticker = await client.fetchTicker( 'BTC/USDT' )
LB           = ticker.last + 0.5
//console.log(await client.fetchTicker( 'BTC/USDT' ))
HA= ticker.last - 0.5
if (pos[0] != undefined){
position = parseFloat(pos[0]['positionAmt'])
	unrealized = parseFloat( pos[0]['unRealizedProfit']) / (position * HA) * parseFloat(pos[0]['leverage']) * 100
	if (position < 0){
		unrealized = unrealized * -1
	}
	if(unrealized > takeProfit){
		if (position > 0){
		await client.createOrder(  'BTC/USDT', "Limit", 'sell', position, LB - 100)
	} else {
		await client.createOrder(  'BTC/USDT', "Limit", 'buy', position * -1, HA + 100)

	}
}
	if(unrealized < stopLoss){	console.log(unrealized)

		if (position > 0){
		await client.createOrder(  'BTC/USDT', "Limit", 'sell', position, LB - 100)
	} else {
		await client.createOrder(  'BTC/USDT', "Limit", 'buy', position * -1, HA + 100)

	}
}
}
//console.log(position)
account         = await client.fetchBalance()
free_btc = parseFloat(account[ 'info' ] [ 'totalInitialMargin' ]) / HA

bal_btc         = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ]) / HA
freePerc = (free_btc / bal_btc)
bal_usd = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ])  
if (first){

	//await client.loadProducts () 
	first = false;
	usd_init = bal_usd//50;
	initial_bal = bal_btc;
	qtybtc  = bal_btc * 50 / 50
			qty = Math.floor( HA * qtybtc / 10 )   / HA
			console.log('qty: ' + qty)
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
pnlusd = -1 * (1-bal_usd/usd_init) * 100
if (pnlusd > ((min_withdrawal_percent * 100) * 2)){
	var new_usd_init = bal_usd * (1-(min_withdrawal_percent) );
binance.mgTransferMarginToMain('USDT', (min_withdrawal_percent) *bal_usd, (error, response) => {
    if (error) {
      console.log(error)
    } else {
		
      usd_init = new_usd_init
	initial_bal = usd_init / LB;
    }
});
}
console.log('RSI: ' + theRSI[theRSI.length-1].k)
console.log('MFI: ' + theMFI[theMFI.length-1])
console.log('diff: ' + diff)
cancelall()
}
count++;
}, 2500)
var count = 0;
const RSI = require('technicalindicators').StochasticRSI;
const MFI = require('technicalindicators').MFI;
var rsis = []
var rsiover = false;
var rsibelow = false;
var mfiover = false;
var mfibelow = false;
var a = 0
var b = 0;
var rsicount = 0;
var buysell = -1
var theRSI = []
var theMFI = []
setInterval(async function(){
ohlcv = await client2.fetchOHLCV ('BTC/USDT', timeframe = rsiTF.toString() + 'm', since = undefined, limit = 74, params = {})
		//console.log(ohlcv)
		var c = 0;
		for (var b in ohlcv){
					ohlcvs.push[ohlcv[b]]
			if (rsis[0] == undefined){
				rsis[0] = []
			}
			rsis[0].push(ohlcv[b][4])
		if (rsis[0].length > 70){
			rsis[0].shift()
		}
		}
theRSI = RSI.calculate({ rsiPeriod : 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3,values : rsis[0]});
//console.log(theRSI[theRSI.length-1].k)
ohlcv = await client2.fetchOHLCV ('BTC/USDT', timeframe = mfiTF.toString() + 'm', since = undefined, limit = 17, params = {})
high = []
	low = []
	close = []
	volume = []
	for (var o in ohlcv){
		high.push(ohlcv[o][2])
		low.push(ohlcv[o][3])
		close.push(ohlcv[o][4])
		volume.push(ohlcv[o][5])
	}
//console.log(high)
		theMFI = MFI.calculate({period : 14, high: high, low:low, close: close, volume: volume});
		//console.log(theMFI[theMFI.length-1])

if (theRSI[theRSI.length-1].k > highRSI){
	rsiover = true;
}
else {
	rsiover = false;
}
if (theRSI[theRSI.length-1].k < lowRSI){
	rsibelow = true;
}
else {
	rsibelow = false;
}
if (theMFI[theMFI.length-1] > highRSI){
	mfiover = true;
}
else {
	mfiover = false;
}
if (theMFI[theMFI.length-1] < lowRSI){
	mfibelow = true;
}
else {
	mfibelow = false;
}
a++

if (a == 60){
	a = 0;
	b++;
}
if (b == rsiTF){
	b = 0;
}
//console.log(theRSI[theRSI.length-1].k)
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
var sltps = []
var openorders = []
setInterval(async function(){
	var split = false;
	for (var t in tps){
		if (tps[t].price <= price && tps[t].direction == 'sell'){
sltps.push(await client.createOrder(  'BTC/USDT', "Limit", 'sell', tps[t].amt, tps[t].price + 100))

  			split = true
		}if (tps[t].price >= price && tps[t].direction == 'buy'){
sltps.push(await client.createOrder(  'BTC/USDT', "Limit", 'buy', tps[t].amt, tps[t].price - 100))
	
split = true
		}
		

	}
	if (split){

		  			tps.splice(t, 1)
sls.splice(t, 1)

	}

	split = false;
	for (var t in sls){
		if (sls[t].price >= price && sls[t].direction == 'sell'){
sltps.push(await client.createOrder(  'BTC/USDT', "Limit", 'sell', sls[t].amt, sls[t].price + 100))

  			split = true
		}if (sls[t].price <= price && sls[t].direction == 'buy'){
sltps.push(await client.createOrder(  'BTC/USDT', "Limit", 'buy', sls[t].amt, sls[t].price - 100))

split = true
		}
		

	}
	if (split){
		  			tps.splice(t, 1)
sls.splice(t, 1)

	}
	var trades = await client.fapiPrivateGetUserTrades({'symbol':'BTCUSDT', 'limit': 1000})
			//console.log(trades)
	//console.log(tradesArr)
	for(var t in trades){
		go = true;
		for (var s in sltps){
			if (sltps[s].id == trades[t].orderId){
				go = false;
			}
		}
			if (!tradesArr.includes(trades[t].id) && go){
				tradesArr.push(trades[t].id)
		/*
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
 'price': parseFloat(trades[t].price)* (1-0.0025)})

				}
				else {
sls.push({'direction': 'sell','i': 'BTC/USDT',
  'amt': parseFloat(trades[t].qty),
 'price': parseFloat(trades[t].price)* (1-0.0045)})

					tps.push({'direction': 'sell','i': 'BTC/USDT',
  'amt': parseFloat(trades[t].qty),
 'price': parseFloat(trades[t].price)* 1.0045})
}
		*/
			}
		}
	//console.log(await client.createOrder(  'BTC/USDT', "Limit", 'sell', 0.001, 8633))
}, 10000)

var dobuy = true;
var ohlcvs = []
async function doit(){
	if (price > index){
		above = 1;
	}
	else {
		above = 0;
	}
	diff = price / index; 
	diff = -1 * (1-diff) * 100 
	if(diff < -1 * minCross / 1.5 && rsiover && (useMFI && mfiover)){
		if (selling == 0 && (freePerc < 1 || position > 0)){
			//selling = 1;
			buysell = 0;
			//buying = 0;
			prc = HA
			qtybtc  = bal_btc * 50 / 50
			qty = Math.floor( prc * qtybtc / 10 )   / HA    
			if (position > 0){
				qty = qty * 2
			}
			if (dobuy){
				dobuy = false;
				setTimeout(function(){
					dobuy = true;
				}, delaybetweenorder * 1000)
			
	openorders.push(await client.createOrder(  'BTC/USDT', "Limit", 'sell', qty, prc))

				//console.log(openorders)
			console.log(new Date() + ': diff: ' + diff + ' RSI: ' + theRSI[theRSI.length-1].k + ' sell!') //ask
		}
		}
	}

	else if (diff > minCross && diff < 100000 && rsibelow && (useMFI && mfibelow)){
		if (buying == 0 && (freePerc < 1 || position < 0)){
			//selling = 0;
			//buying = 1;
			buysell = 1;
			prc = LB
			qtybtc  = bal_btc * 50 / 50
			qty = Math.floor( prc * qtybtc / 10 )   / LB 
			if (position < 0){
				qty = qty * 2
			}
				if (dobuy){
				dobuy = false;
				setTimeout(function(){
					dobuy = true;
				}, delaybetweenorder * 1000)
		
openorders.push(await client.createOrder(  'BTC/USDT', "Limit", 'buy', qty, prc))

				//console.log(openorders)

			console.log(new Date() + ': diff: ' + diff + ' RSI: ' + theRSI[theRSI.length-1].k + ' buy!') //bid
		
		}}

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

var username = "jaredunn",
    password = "Melani3B4b%",
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");


var lowRSI = 20
var highRSI = 80
var minCrossSell = 0.1
var minCrossBuy = 0.1
var useMFI = false
var rsiTF = 1
var mfiTF = 1
var period = 54
var kvalue = 5
var dvalue = 3
var doRequest = false
var debug = process.env.debug
if (debug == 'true'){
    debug = true
}
else {
    debug = false
}
var log = process.env.log
if (log == 'false'){
    log = false
}
else {
    log = true
}
        const axios = require('axios')

var request = require('request')
const req = request({
    method: "GET",
    url: 'http://tradingserver.zulutrade.com/stream',
    json: true,
    forever: true
}).on("data", function (e, r, d){
console.log(d)
});
async function getVars(){
if (doRequest){
request.get("https://patrickbot.dunncreativess.now.sh/vars", function (e, r, d){
    try {
        j = JSON.parse(d)
        lowRSI = parseFloat(j.lowRSI)
        highRSI = parseFloat(j.highRSI)
        minCrossSell = parseFloat(j.minCrossSell)
        minCrossBuy = parseFloat(j.minCrossBuy)
        rsiTF = parseFloat(j.RSItf)
        period = parseFloat(j.RSIPeriod) 
    }
    catch (err){
        console.log(err)
    }
})
}

}
getVars()
setInterval(async function(){
getVars()
}, 1000 * 60 * 60 * 4)
var delaybetweenorder = 60//sec
var takeProfit = parseFloat(process.env.takeProfit) //%
var stopLoss = parseFloat(process.env.stopLoss) //%
var min_withdrawal_percent = parseFloat(process.env.min_withdrawal_percent) 
var key=process.env.key
var tgUser=process.env.tgUser
var secret=process.env.secret
var keygood = true;

var maxFreePerc = parseFloat(process.env.maxFreePerc)
var orderSizeMult = parseFloat(process.env.orderSizeMult)
const ccxt = require('ccxt')
var bitmex = new ccxt.bitmex()

var doWithdraw = process.env.doWithdraw
if (doWithdraw == 'true'){
    doWithdraw = true
}else {
    doWithdraw = false
}
var withdrawMin 

var client2 = new ccxt.binance({
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
}) //client.urls['api'] = client.urls['test']
var account;
var LB;
var HA;
var bal_usd;
var usd_init;
var bal_btc;
//cancelall()
async function cancelall() {
    request(
    {
        url : 'http://tradingserver.zulutrade.com/getOpen',
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
       ords = JSON.parse(body).openOrders
           for (var order in ords) {
        if (true) {
            oid = ords[order]['uniqueId']
            //if (buysell == 1 && side == 'buy'){
            //  console.log('cancelleing2...')
            try {

url = 'http://tradingserver.zulutrade.com/close/pending/?currencyName=BTCUSD&lots=' + ords[order].lots + '&buy=' + ords[order].buy + '&uniqueId=' + oid
        request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {

    })
            } catch (e) {
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
);
    


}
var initial_bal;
first = true;
var freePerc;
var position = 0;
setInterval(async function() {
    ticker = await client2.fetchTicker('BTC/USDT')
    LB = ticker.last + 0.5
    //console.log(await client.fetchTicker( 'BTC/USDT' ))
    HA = ticker.last - 0.5
    if (first) {
        /* var trades = await client.fapiPrivateGetUserTrades({
            'symbol': 'BTC/USDT',
            'limit': 1000
        })
        for (var t in trades) {
            tradesArr.push(trades[t].id)
        } */
        ohlcv = await client2.fetchOHLCV('BTC/USDT', timeframe = '1h', since = undefined, limit = 74, params = {})
        //console.log(ohlcv)
        var c = 0;
        for (var b in ohlcv) {
            ohlcvs.push[ohlcv[b]]
            if (rsis[0] == undefined) {
                rsis[0] = []
            }
            rsis[0].push(ohlcv[b][4])
            if (rsis[0].length > 1000) {
                rsis[0].shift()
            }
        }
        ohlcv = await client2.fetchOHLCV('BTC/USDT', timeframe = '1h', since = undefined, limit = 1000, params = {})
        //console.log(ohlcv)
        high = []
        low = []
        close = []
        volume = []
        for (var o in ohlcvs) {
            high.push(ohlcvs[o][2])
            low.push(ohlcvs[o][3])
            close.push(ohlcvs[o][4])
            volume.push(ohlcvs[o][5])
        }
        //console.log(rsis[0])
        //console.log(high)
        theRSI = RSI.calculate({
            rsiPeriod: period,
            stochasticPeriod: period,
            kPeriod: kvalue,
            dPeriod: dvalue,
            values: rsis[0]
        });

        theMFI = MFI.calculate({
            period: 14,
            high: high,
            low: low,
            close: close,
            volume: volume
        });
        //console.log(theMFI[theMFI.length-1])
    }
    request(
    {
        url : 'http://tradingserver.zulutrade.com/getOpen',
        headers : {
            "Authorization" : auth
        }
    },
    async function (error, response, body) {
       pos = JSON.parse(body).openPositions
    
    if (pos[0] != undefined) {
        position = parseFloat(pos[0]['lots'])
        if (pos[0].buy == false){
            position = position * -1;
        }
        unrealized = parseFloat(pos[0]['floatingPnl']) /  HA 
        
        if (unrealized > takeProfit) {
            if (position > 0) {
                uid = Math.random() * 10000 * 10000 * 10000 * 10000
                uid = Math.floor(uid)
url = 'http://tradingserver.zulutrade.com/open/market/?currencyName=BTCUSD&lots=' + position + '&buy=false&requestedPrice=' + (LB - 100) + '&uniqueId=' + uid
request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
  if (error) console.log(error)          
})
              } else {
uid = Math.random() * 10000 * 10000 * 10000 * 10000
                uid = Math.floor(uid)
url = 'http://tradingserver.zulutrade.com/open/market/?currencyName=BTCUSD&lots=' + (position * -1) + '&buy=true&requestedPrice=' + (LB + 100) + '&uniqueId=' + uid
request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
  if (error) console.log(error)          
})
            }
        }
        if (unrealized < stopLoss) {
            console.log(unrealized)
if (position > 0) {
                uid = Math.random() * 10000 * 10000 * 10000 * 10000
                uid = Math.floor(uid)
url = 'http://tradingserver.zulutrade.com/open/market/?currencyName=BTCUSD&lots=' + position + '&buy=false&requestedPrice=' + (LB - 100) + '&uniqueId=' + uid
request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
  if (error) console.log(error)          
})
              } else {
uid = Math.random() * 10000 * 10000 * 10000 * 10000
                uid = Math.floor(uid)
url = 'http://tradingserver.zulutrade.com/open/market/?currencyName=BTCUSD&lots=' + (position * -1) + '&buy=true&requestedPrice=' + (LB + 100) + '&uniqueId=' + uid
request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
  if (error) console.log(error)          
})
            }
        }
    }
})
    //console.log(position)
    //account = await client.fetchBalance()
    	maxwithdrawamt=50000
    free_btc = 50000 / HA

    bal_btc = 50000 / HA
    bal_usd = 50000


    freePerc = (maxwithdrawamt / bal_usd)
   // console.log(freePerc)
    if (first) {

        //await client.loadProducts () 
        first = false;
        usd_init = bal_usd //50;
        initial_bal = bal_btc;
        qtybtc = bal_btc * 50 / 50
        qty = Math.floor(HA * qtybtc / 10) / HA
        qty = qty * orderSizeMult
                    qty = Math.ceil(qty)
     console.log('qty: ' + qty)
     console.log('HA: ' + HA)
    }

    if (count >= 4 * 6 * 1) {
        count = 0;

axios.post('https://patrickbot.dunncreativess.now.sh/user', { user: tgUser,
  bal: bal_usd,
  now: new Date().getTime(),
  bal_init: usd_init })
.then((res) => {
    if (log){
  console.log(`statusCode: ${res.statusCode}`)
}
  //console.log(res)
})
.catch((error) => {
  console.error(error)
})
if (log){

        console.log(' ')
        console.log('-----')
        console.log(new Date())
        console.log('position: ' + position)
        console.log('usedPerc: ' + freePerc)
        if (debug){
        console.log('q1: ' + rsiover)
        console.log('q2: ' + rsibelow)
        console.log('q3')
        console.log(diff < -1 * minCrossSell)
        console.log('q4')
        console.log(diff > minCrossBuy && diff < 100000)
        console.log('q5: ' + selling)
        console.log('q6: ' + buying)
        console.log('v1: ' + theRSI[theRSI.length - 1].k)
        console.log('v2: ' + diff)
        console.log('v3: ' + minCrossSell)
        console.log('v4: ' + minCrossBuy)
        console.log('bal btc: ' + bal_btc)
        console.log('pnl btc: % ' + -1 * (1 - bal_btc / initial_bal) * 100)
        }
        console.log('bal usd: ' + bal_usd)
        console.log('pnl usd: % ' + -1 * (1 - bal_usd / usd_init) * 100)
        }
        pnlusd = -1 * (1 - bal_usd / usd_init) * 100
        if (doWithdraw){
        if (pnlusd > ((min_withdrawal_percent * 100) * 2)) {
            var new_usd_init = bal_usd * (1 - (min_withdrawal_percent));

        }
        }
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
setInterval(async function() {
    ohlcv = await client2.fetchOHLCV('BTC/USDT', timeframe = '1h', since = undefined, limit = 1000, params = {})
    //console.log(ohlcv)
    var c = 0;
    for (var b in ohlcv) {
        ohlcvs.push[ohlcv[b]]
        if (rsis[0] == undefined) {
            rsis[0] = []
        }
        rsis[0].push(ohlcv[b][4])
        if (rsis[0].length > 1000) {
            rsis[0].shift()
        }
    }
    theRSI = RSI.calculate({
        rsiPeriod: period,
        stochasticPeriod: period,
        kPeriod: kvalue,
        dPeriod: dvalue,
        values: rsis[0]
    });
    //console.log(theRSI[theRSI.length-1].k)
    ohlcv = await client2.fetchOHLCV('BTC/USDT', timeframe = '1h', since = undefined, limit = 17, params = {})
    high = []
    low = []
    close = []
    volume = []
    for (var o in ohlcv) {
        high.push(ohlcv[o][2])
        low.push(ohlcv[o][3])
        close.push(ohlcv[o][4])
        volume.push(ohlcv[o][5])
    }
    //console.log(high)
    theMFI = MFI.calculate({
        period: 14,
        high: high,
        low: low,
        close: close,
        volume: volume
    });
    //console.log(theMFI[theMFI.length-1])

    if (theRSI[theRSI.length - 1].k > highRSI) {
        rsiover = true;
    } else {
        rsiover = false;
    }
    if (theRSI[theRSI.length - 1].k < lowRSI) {
        rsibelow = true;
    } else {
        rsibelow = false;
    }
    if (theMFI[theMFI.length - 1] > highRSI) {
        mfiover = true;
    } else {
        mfiover = false;
    }
    if (theMFI[theMFI.length - 1] < lowRSI) {
        mfibelow = true;
    } else {
        mfibelow = false;
    }
    a++

    if (a == 60) {
        a = 0;
        b++;
    }
    if (b == rsiTF) {
        b = 0;
    }
    //console.log(theRSI[theRSI.length-1].k)
}, 1000);

var above = 0;
var price = 0;
var index = 0;
var buying = 0;
var selling = 0;
var diff;
var tps = []
var sls = []
var tradesArr = []
var sltps = []
var openorders = []

var dobuy = true;
var ohlcvs = []
var request = require('request');
async function doit() {
    if (keygood){


            if (price > index) {
                above = 1;
            } else {
                above = 0;
            }
            diff = price / index;
            diff = -1 * (1 - diff) * 100
            if (diff < -1 * minCrossSell && rsiover) { //} && (useMFI && mfiover)){
                console.log('it wants to sell 1')
                if (selling == 0){// && (freePerc < maxFreePerc || position > 0)) {
                    console.log('it wants to sell 2')
                    //selling = 1;
                    buysell = 0;
                    //buying = 0;
                    prc = HA
                    qtybtc = bal_btc * 50 / 50
                    qty = Math.floor(prc * qtybtc / 10) / HA
                    qty = qty * orderSizeMult
                    qty = Math.ceil(qty)
                    if (position > 0) {
                        qty = qty * 2
                    }
                    if (dobuy) {
                        console.log('it wants to sell 3')
                        dobuy = false;
                        setTimeout(function() {
                            dobuy = true;
                        }, delaybetweenorder * 1000)

                uid = Math.random() * 10000 * 10000 * 10000 * 10000
                uid = Math.floor(uid)
url = 'http://tradingserver.zulutrade.com/open/market/?currencyName=BTCUSD&lots=' + (qty) + '&buy=false&requestedPrice=' + (prc) + '&uniqueId=' + uid
request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
  if (error) console.log(error)          
})
                        //console.log(openorders)
                        console.log(new Date() + ': diff: ' + diff + ' RSI: ' + theRSI[theRSI.length - 1].k + ' sell!') //ask
                    }
                }
            } else if (diff > minCrossBuy && diff < 100000 && rsibelow) { //} && (useMFI && mfibelow)){
                console.log('it wants to buy 1')
                if (buying == 0){// && (freePerc < maxFreePerc || position < 0)) {
                    console.log('it wants to buy 2')
                    //selling = 0;
                    //buying = 1;
                    buysell = 1;
                    prc = LB
                    qtybtc = bal_btc * 50 / 50
                    qty = Math.floor(prc * qtybtc / 10) / LB
                    qty = qty * orderSizeMult
                    qty = Math.ceil(qty)
                    if (position < 0) {
                        qty = qty * 2
                    }
                    if (dobuy) {
                        console.log('it wants to buy 3')
                        dobuy = false;
                        setTimeout(function() {
                            dobuy = true;
                        }, delaybetweenorder * 1000)

                uid = Math.random() * 10000 * 10000 * 10000 * 10000
                uid = Math.floor(uid)
url = 'http://tradingserver.zulutrade.com/open/market/?currencyName=BTCUSD&lots=' + (qty) + '&buy=true&requestedPrice=' + (prc) + '&uniqueId=' + uid
request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
  if (error) console.log(error)          
})
                        //console.log(openorders)

                        console.log(new Date() + ': diff: ' + diff + ' RSI: ' + theRSI[theRSI.length - 1].k + ' buy!') //bid

                    }
                }

            }
        }

    
}
setInterval(function(){
    doit()
},1 *1000)
setInterval(async function(){
//ticker1 = await bitmex.fetchTicker('BTCUSD')

//price = ticker1.lastPrice
//index=(ticker1.markPrice)


request.get('https://www.bitmex.com/api/v1/instrument?symbol=XBTUSD', function (e, r, d){
try {
j = JSON.parse(d)[0].lastPrice

j2 = JSON.parse(d)[0].markPrice
price=j
index=j2
}
catch (err){
    console.log(err)
}
})
}, 4000)
/*setInterval(function(){
    console.log(index)
    console.log(price)
}, 500) */
/*
ws.addStream('XBTUSD', 'instrument', async function(data, symbol, tableName) {
    if (data[0].lastPrice != undefined){
    price = (data[0].lastPrice)
}
    doit()
});

ws.addStream('.BXBT', 'instrument', async function(data, symbol, tableName) {
    if (data[0].lastPrice != undefined){
    index = (data[0].lastPrice)
}
    doit()
});
*/
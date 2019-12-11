var ejs = require('ejs')
const binance = require('node-binance-api')().options({
  APIKEY:process.env.key,
  APISECRET: process.env.secret,
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

var PortfolioAnalytics = require ('portfolio-analytics')
var avg = 0
var high = 0
async function dodds(){
  start = btcs[0][0]
                dds = {}
                a = -1
                for (var t =0; t<=btcs.length; t = t + 5){
                if (btcs[t] != undefined){                d = btcs[t][0]
                tf = d - 1000 * 60 * 60 * 24
                a++
                for (var btc  = 0; btc <= btcs.length; btc = btc + 5){
                if (btcs[btc] != undefined){
                if (btcs[btc][0] > tf && btcs[btc][0] < d){
                if (dds[a] == undefined){
                dds[a] = []
                }
                    dds[a].push((btcs[btc][1].toFixed(20)))
                
                
                }
                }
                }
                }
                }
                drawdowns = []
                high = 0
                for (var dd in dds){
                drawdowns.push(PortfolioAnalytics.maxDrawdown(dds[dd]))
                }
                t = 0
                for (var dd in drawdowns){
                t+=drawdowns[dd]
                if (drawdowns[dd] > high){
                high = drawdowns[dd]
                }
                }
                avg = t / drawdowns.length
}

setInterval(function(){
dodds()
}, 60 * 1000 * 5)

setTimeout(function(){
dodds()
}, 60 * 1000)

var btc = 0;
const ccxt = require('ccxt')
var client = new ccxt.binance(
            {"apiKey": process.env.key,
            "secret":process.env.secret,
            "options":{"defaultMarket":"futures"},
            'urls': {'api': {
                                     'public': 'https://fapi.binance.com/fapi/v1',
                                     'private': 'https://fapi.binance.com/fapi/v1',},}
 })
var client2 = new ccxt.binance(
            {"apiKey": process.env.key,
            "secret": process.env.secret,
            })
var btcstart = 0
var btcs = []
var ids = []
var vol = 0
var first = true;
var position = 0;
setInterval(async function(){
account         = await client.fetchBalance()
account2         = await client2.fetchBalance()
//console.log(account)
trades = await client.fapiPrivateGetUserTrades({'symbol':'BTCUSDT', 'limit': 1000})
for (var t in trades){
  if (!ids.includes(trades[t].id)){
    ids.push(trades[t].id)
vol+=parseFloat(trades[t].qty)

  }

}
pos = await client.fapiPrivateGetPositionRisk()
if (pos[0] != undefined){
position = parseFloat(pos[0]['positionAmt'])
}
console.log(account.info.assets)
btc = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ])
btc+=(account2['total']['USDT'])
if (first)
{
btcstart = btc

first = false;
}
console.log(btcstart)
console.log(btc)
if (btc != 0){
btcs.push( [new Date().getTime(), -1 * (1-(btc / btcstart)) * 100])
bals.push([new Date().getTime(), btc])
}
}, 1500)

const express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var request = require("request")
var bodyParser = require('body-parser')
app.set('view engine', 'ejs');
app.listen(parseFloat(process.env.port) || 8081, function() {});
app.get('/update', cors(), (req, res) => {

    res.json({avg: avg, high: high, bal: bals, btc: btcs, qty: vol, pos: position})

})

app.get('/', (req, res) => {
        res.render('index.ejs', {
            btc: btc,
            site: process.env.site,
            port: process.env.port
        })

});
var bals = []
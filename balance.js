
const binance = require('node-binance-api')().options({
  APIKEY: "yUJluobNfQ5H1nQ9Cp3czdmHL27Wz8I61E1b7tsR2hMYApLCbPbeezvtQWj2D2NL",
  APISECRET: "v0BwW14iRs91eppXZYsrqUxYdYTxpWotJNPgpkcph6N3q9mmMOi23BlQrBwSBKZ4",
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

const Binance = require('binance-api-node').default
const client2 = Binance({
  apiKey: 'yUJluobNfQ5H1nQ9Cp3czdmHL27Wz8I61E1b7tsR2hMYApLCbPbeezvtQWj2D2NL',
  apiSecret: 'v0BwW14iRs91eppXZYsrqUxYdYTxpWotJNPgpkcph6N3q9mmMOi23BlQrBwSBKZ4'
})
const api = require('binance');
const binanceRest = new api.BinanceRest({
    key: 'yUJluobNfQ5H1nQ9Cp3czdmHL27Wz8I61E1b7tsR2hMYApLCbPbeezvtQWj2D2NL', // Get this from your account on binance.com
    secret: 'v0BwW14iRs91eppXZYsrqUxYdYTxpWotJNPgpkcph6N3q9mmMOi23BlQrBwSBKZ4', // Same for this
})
const binanceWS = new api.BinanceWS(true); // Argument specifies whether the responses should be beautified, defaults to true
binanceWS.onUserData(binanceRest, (data) => {
        console.log(data);
    }, 60000) // Optional, how often the keep alive should be sent in milliseconds
    .then((ws) => {
        // websocket instance available here
    });

async function ws(){
const clean = await client2.ws.user(msg => {
  console.log(msg)
})
//clean()
}
ws()

var btc = 0;
const ccxt = require('ccxt')
var client = new ccxt.binance(
            {"apiKey": "yUJluobNfQ5H1nQ9Cp3czdmHL27Wz8I61E1b7tsR2hMYApLCbPbeezvtQWj2D2NL",
            "secret": "v0BwW14iRs91eppXZYsrqUxYdYTxpWotJNPgpkcph6N3q9mmMOi23BlQrBwSBKZ4",
            "options":{"defaultMarket":"futures"},
            'urls': {'api': {
                                     'public': 'https://fapi.binance.com/fapi/v1',
                                     'private': 'https://fapi.binance.com/fapi/v1',},}
 })
var btcstart = 0
var btcs = []
var ids = []
var vol = 0
var first = true;
var position = 0;
setInterval(async function(){
account         = await client.fetchBalance()
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
btc = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ])
if (first)
{
btcstart = btc

first = false;
}
console.log(btcstart)
console.log(btc)
}, 1500)

const express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var request = require("request")
var bodyParser = require('body-parser')
app.set('view engine', 'ejs');
app.listen(process.env.PORT || 8080, function() {});
app.get('/update', cors(), (req, res) => {
if (btc != 0){
btcs.push( [new Date().getTime(), -1 * (1-(btc / btcstart)) * 100])
}
    res.json({btc: btcs, qty: vol, pos: position})

})

app.get('/', (req, res) => {
        res.render('index.ejs', {
            btc: btc
        })

});

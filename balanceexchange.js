
const binance = require('node-binance-api')().options({
  APIKEY:process.env.key,
  APISECRET: process.env.secret,
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});



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
console.log(account)

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
if (btc != 0){
btcs.push( [new Date().getTime(), -1 * (1-(btc / btcstart)) * 100])
}
    res.json({btc: btcs, qty: vol, pos: position})

})

app.get('/', (req, res) => {
        res.render('index.ejs', {
            btc: btc,
            site: process.env.site,
            port: process.env.port
        })

});

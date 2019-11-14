
const binance = require('node-binance-api')().options({
  APIKEY: "z4GiNxIiJRCxfTtbKqcSgSXcbNJqLKW5qNRarj6K9PeGzXoAKChot0UesyUwhCaI",
  APISECRET: "vW57vcFOSeA1yrdSonds31QF7LHnnBDg763LnCHOQWMalPjX2mvudvKqTqWL6pmz",
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});
var btc = 0;
const ccxt = require('ccxt')
var client = new ccxt.binance(
            {"apiKey": "z4GiNxIiJRCxfTtbKqcSgSXcbNJqLKW5qNRarj6K9PeGzXoAKChot0UesyUwhCaI",
            "secret": "vW57vcFOSeA1yrdSonds31QF7LHnnBDg763LnCHOQWMalPjX2mvudvKqTqWL6pmz",
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
app.listen(process.env.PORT || 80, function() {});
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

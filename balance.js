
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
var btcstart
var btcs = []
var ids = []
var vol = 0
var first = true;
setInterval(async function(){
account         = await client.fetchBalance()
//console.log(account)

btc = parseFloat(account[ 'info' ] [ 'totalMarginBalance' ])
if (first)
{
btcstart = btc
first = false;
}
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
    res.json({btc: btcs, qty: vol})

})

app.get('/', (req, res) => {
        res.render('index.ejs', {
            btc: btc
        })

});

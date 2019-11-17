var ccxt = require('./ccxt/ccxt.js')
client = new ccxt.bybit({'apiKey': 'fXDuz7D78aWC7NU2Wb',
'secret': 'uiEDVc1jSdyxW7bgQrRIuJfosuChdHEgALeU'})
console.log(client)

async function test(){
	bal = await client.fetchBalance()
	console.log(bal)
}
//test()
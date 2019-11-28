var express = require("express");
var app = express();
var request = require('request');
var bodyParser = require("body-parser");
app.use(express.json())

const axios = require("axios");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
console.log("run");
function sendMessage(url, message,reply,res){
	
axios.post(url, {
	chat_id: message.chat.id,
    text: reply
}).then(response => {
    console.log("Message posted");
    res.end("ok");
}).catch(error =>{
    console.log(error);
});
}
app.get('/', function(req, res){
	res.send('hello');
})
var thens = {}
var users = []
var bals = {}
app.post('/user', function(req, res){

if (req.body != undefined){
var user = req.body.user
var  bal = req.body.bal
 var now = req.body.now
 var bal_init = req.body.bal_init
 var t;
 if (bals[user] != undefined){
 	bals[user] = {bal: -1 * (1-(bal / bal_init)) * 100, now: now, bal_init: bal_init, then: thens[user]}
 }
 else {
 	thens[user] = now
 	bals[user] = {bal: -1 * (1-(bal / bal_init)) * 100, now: now, bal_init: bal_init, then: now}
 }
 	

 
}
console.log(bals)
	res.send('200')
})
app.post("/start_bot2", function(req, res) {

	console.log("startbot");
const { message } = req.body;
let reply = "";
if (message.text != undefined){
if (message.text.toLowerCase().indexOf("statusupdate") != -1){
	if (message.text.split(' ').length > 0){
	var b = message.text.split(' ')[1]
	reply+=b + '\n'

	if (bals[b]!=undefined){
    reply = ""
		start = bals[b].then
		btc = bals[b].bal
		end = bals[b].now
		diff = end - start
		var s = diff / 1000
		var m = s / 60
		var h = m / 60
		var d = h / 24
		var y = d / 365
		var apr = (bals[b].bal) / y
		reply += "Start: " + new Date(start) + '\n'
		reply += "Now: " + new Date(end) + "\n"
		reply += "BTC % Delta: " + btc.toPrecision(4) + '%\n'
		reply += "BTC % ROI / day projected: " + (apr / 365).toPrecision(4) + '%\n'
		reply += "BTC % APR projected: " + (apr).toPrecision(4) + '%\n\n'
		sendMessage(telegram_url,message,reply,res);
	}
	else {
		sendMessage(telegram_url,message,b,res);
	}
}
	else {
		res.send('ok')
	}

}

	else {
		res.send('ok')
	}
}
	else {
		res.send('ok')
	}
});
let telegram_url = "https://api.telegram.org/bot1065628648:AAH7Mpl7d1_kzIWDG6L4ZDvS3H9oTBy4KUI/sendMessage";
app.listen(8000, () => console.log("Telegram bot is listening on port 3000!"));


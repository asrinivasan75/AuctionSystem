var bodyParser = require('body-parser');
var express = require('express');
var winston = require('winston');
var moment = require('moment');
var os=require("os");

var MAC = ''

app = express(),
port = 80
server = require('http').createServer(app),

logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: 'http.log' }),
        new winston.transports.Console()
    ]
});

app.use('/', express.static(__dirname + '/www'));

app.use(bodyParser.json({
    type: 'application/json'
}))
app.use(bodyParser.urlencoded({
    type: 'application/x-www-form-urlencoded'
}))
app.use(bodyParser.text({
    type: '*/*'
}))

app.get('*', reqHandler);
app.post('*', reqHandler);
app.put('*', reqHandler);
app.delete('*', reqHandler);

server.listen(process.env.PORT || 80);
console.log('Auction System server started');



function reqHandler(req, res) {
    logger.info(formatReq(req))
    res.send('OK')
}

function formatReq(req) {
    console.log('Bteuch logs:');
    let logStr = getStandardDateTime()
    logStr += `\n\tHeader:`
    logStr += `${toString(req.headers, 2)}`
    logStr += `\n\t${req.method} ${req.path}`
    logStr += `\n\tQuery:`
    logStr += `${toString(req.query, 2)}`
    if (req.method !== 'GET') {
        logStr += `\n\tBody:`
        if (req.body instanceof Object) {
            logStr += `${toString(req.body, 2)}`
        } else {
            logStr += `\n\t\t${req.body}`
        }
    }
    var networkInterfaces=os.networkInterfaces();
    for(var i in networkInterfaces){
        for(var j in networkInterfaces[i]){
            if(networkInterfaces[i][j]["family"]==="IPv4" && networkInterfaces[i][j]["mac"]!=="00:00:00:00:00:00" && networkInterfaces[i][j]["address"]!=="127.0.0.1"){
                mac = networkInterfaces[i][j]["mac"]
            }
        }
    }
    console.log(mac) //01:02:03:0a:0b:0c
    return logStr
}

function getStandardDateTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

function toString(obj, tabCount = 2) {
    let str = ''
    let item
    for (let key in obj) {
        item = obj[key]
        str += '\n'
        for (let i = 0; i < tabCount; i++) {
            str += '\t'
        }
        str += `${key}:`
        if (item instanceof Object) {
            str += toString(item, tabCount + 1)
        } else {
            str += ` ${item}`
        }
    }
    return str
}

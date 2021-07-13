const request = require('request')
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('*', function (client_req, client_res) {
    let options = {
        url: 'http://apis.data.go.kr'+client_req.url,
        method: 'GET',
        timeout: 100000
    };

    request(options, function (error, res) {
        if (error){
            console.error(error)
            return;
        }
        client_res.header('Access-Control-Allow-Origin', '*')
        client_res.status(res.statusCode)
        client_res.send(res.body)
    });
})

app.listen(port)
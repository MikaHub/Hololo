console.log('testconsole')
const express = require('express')
const app = express()
var port = process.env.PORT || 3000;
console.log("port:" + port)

app.get('/test', (req, res) => {
    console.log("here")
    res.send('Hello Test')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

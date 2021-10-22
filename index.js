console.log('testconsole')
const express = require('express')
const app = express()
var port = process.env.PORT || 3000;
console.log("port:" + port)
console.log(process.env.PORT)
console.log(process.env)

app.get('/ping', (req, res) => {
    console.log("here")
    res.send('Hello ping')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

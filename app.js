const path = require('path')
const express = require('express')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const server = app.listen(5555, () => {
    console.log(`Express ready on ${5555}`)
})
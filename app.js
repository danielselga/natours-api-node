const express = require('express')
const fs = require('fs')

const app = express()

// app.get('/', (req, res) => {
//     res.status(200).json({
//         message: 'Hello from the server side...',
//         app: 'natours'
//     })
// })

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...')
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)) //JSON.parse get a json and return a JS Object

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

const port = 3000
app.listen(port, () => {
    console.log(`App runing on port ${port}...`)
})


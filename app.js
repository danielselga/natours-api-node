const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

// Creating a middleware

app.use((req, res, next) => { // Will apply to all req
    console.log('Hello from the middleware')
    next(); // Next needed to be caled in the end of the midleware
})

app.use((req, res, next) => { // Will apply to all req
    req.requestTime = new Date().toISOString() 
    next(); // Next needed to be caled in the end of the midleware
})

// JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)) //JSON.parse get a json and return a JS Object

// Callback functions
const getAlltours = (req, res) => {
        console.log(req.requestTime)
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
}

const getTour = (req, res) => {
        console.log(req.params)
    
        const id = Number(req.params.id)
        const tour = tours.find(el => el.id === id)
    
        if(!tour) {
            return res.status(404).json({
                status: 'fail',
                message: 'Invalid id'
            })
        }
    
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
}

const createTour = (req, res) => {
        const newId = tours[tours.length - 1].id = + 1
        const newTour = Object.assign({id: newId}, req.body) //Object assing  permits to merge an existing object.
    
        tours.push(newTour)
        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
            res.status(201).json({
                status: 'Success',
                data: {
                    tour: newTour,
                }
            })
        })
}

const patchTour = (req, res) => {
        if(Number(req.params.id) > tours.length) {
            return res.status(404).json({
                status: 'fail',
                message: 'Invalid id'
            })
        }
    
        res.status(200).json({
            status: 'success',
            data: {
                tour: '<Updated tour here>'
            }
        })
}

const deleteTour = (req, res) => {
        if(Number(req.params.id) > tours.length) {
            return res.status(404).json({
                status: 'fail',
                message: 'Invalid id'
            })
        }
    
        res.status(204).json({
            status: 'success',
            data: null
        })
}

// Reqs end points

// app.get('/api/v1/tours', getAlltours)
// app.post('/api/v1/tours', createTour)
// app.get('/api/v1/tours/:id/', getTour)
// app.patch('/api/v1/tours/:id', patchTour)
// app.delete('/api/v1/tours/:id', deleteTour)

//Chaining request methods

app.route('/api/v1/tours').get(getAlltours).post(createTour)

// Aqui o middleware não irá disparar caso alguns desses metodos "ACIMA" forem chamados pois ele foi invocado depois.

// app.use((req, res, next) => { // Will apply to all req
//     console.log('Hello from the middleware')
//     next(); // Next needed to be caled in the end of the midleware
// })

app.route('/api/v1/tours/:id/').get(getTour).patch(patchTour).delete(deleteTour)

// Caso alguns desses metodos que foram invocados depois do middleware for chamado ele vai ser disparado.

// Opening the server
const port = 3000
app.listen(port, () => {
    console.log(`App runing on port ${port}...`)
})


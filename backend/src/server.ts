import express from 'express'
import path from 'path'
import cors from 'cors'
import 'express-async-errors'

import './database/connection'

import routes from './routes'
import errorHandler from './errors/handler'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`server running on port ${PORT}`))

// yarn typeorm migration:run
// yarn typeorm migration:create -n create_images

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhook } from './controllers/webhooks.js'

//initialize express app
const app = express()

//Connect to Database
await connectDB()

//middleware
app.use(cors())

//Routes
app.get('/', (req, res) => res.send('API is working'))
app.post('/clerk', express.json() , clerkWebhook)

//Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

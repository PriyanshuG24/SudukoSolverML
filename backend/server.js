require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors = require('cors');
const sudukoRouter=require('./routes/sudukoSolverRoutes')

//express app
const app=express()

// Enable CORS
app.use(cors());


//middleware
app.use(express.json())
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

//routes

app.use('/api/sudukosolver',sudukoRouter)

//connect to db
mongoose.connect(process.env.MONGO_URL)
   .then(()=>{
    //listen the request
    app.listen(process.env.PORT,()=>{
        console.log("connect to db listeneing on port ",process.env.PORT)
    })
   }).catch((error)=>{
    console.log(error)
   })
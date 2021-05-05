const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
require('dotenv').config()
// import routes
const postRoutes=require('./routes/post')

// app
const app=express()

// db
mongoose.connect('mongodb+srv://ofer3k:ofer3k1998@react-crud.ddpml.mongodb.net/myFirstDatabase3?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`DB connected`)
}).catch(err=>console.log(err))

// middlewares
app.use(cors())
// app.use(morgan('dev'))
app.use(bodyParser.json())


// routes middlewars
app.use('/api/mongo',postRoutes)


// port
const port=process.env.PORT||8001
// listen
app.listen(port,()=>{
    console.log(`running on ${port}`)
})

const mongoose=require('mongoose')
// const {ObjectId}=mongoose.Schema

const graphSchema=new mongoose.Schema({
    title:{
        type:mongoose.Schema.Types.Mixed
    }
},{timestamps:true})

module.exports=mongoose.model('Graph',graphSchema)
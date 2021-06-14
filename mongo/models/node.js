const mongoose=require('mongoose')
// const {ObjectId}=mongoose.Schema

const nodeSchema=new mongoose.Schema({
    url:{
        type:String,
        unique:true,
        trim:true,
        min:3,
        max:160,
        require:true,
    },
    father:{
        type:String,
        trim:true,
        min:3,
        max:160,
        require:true,
    }
},{timestamps:true})

module.exports=mongoose.model('Node',nodeSchema)
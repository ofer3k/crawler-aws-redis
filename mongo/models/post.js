const mongoose=require('mongoose')
// const {ObjectId}=mongoose.Schema

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        min:3,
        max:160,
        require:true,
    },
    childrens:{
        type:Array,
    }
},{timestamps:true})

module.exports=mongoose.model('Post',postSchema)
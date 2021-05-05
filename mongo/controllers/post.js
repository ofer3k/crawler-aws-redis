const Post=require('../models/post')
exports.create=(req,res)=>{
   console.log(req.body)
const{title}=req.body //req.params

// create
Post.create({title},(err,post)=>{
    if(err){
        console.log(err)
        res.status(400).json({error:'Duplicate post. try another title'})
    }
    res.json(post)
})
} 
exports.list=(req,res)=>{
    Post.find({}).exec((err,posts)=>{
        if(err)console.log(err)
        res.json(posts)
    })

}
// exports.read=(req,res)=>{
//     const {slug}=req.params
//     Post.findOne({slug}).exec((err,post)=>{
//         if(err)console.log(err)
//         res.json(post)
//     })
// }

// exports.update=(req,res)=>{
//     const {slug}=req.params
//     const {title,content,user}=req.body
//     Post.findOneAndUpdate({slug},{title,content,user},{new:true}).exec((err,post)=>{
//         if(err) console.log(err)
//         res.json(post)
//     })
// }
// exports.remove=(req,res)=>{
//     const {slug}=req.params
//     Post.findOneAndRemove({slug}).exec((err,post)=>{
//         if(err)console.log(err)
//         res.json({
//             message:'Post deleted'
//         })
//     })
// }

exports.removeAll=async(req,res)=>{
    // const {slug}=req.params
    try {
        await Post.deleteMany();
        console.log('All Data successfully deleted');
      } catch (err) {
        console.log(err);
      }
      res.send('all was deleted')
}

  
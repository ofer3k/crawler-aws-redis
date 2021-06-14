
const Node=require('../models/node')
exports.create=(req,res)=>{
   console.log(req.body)
const {url,father}=req.body //req.params

// create
Node.create({url,father},(err,post)=>{
    if(err){
        console.log(err)
        res.status(400).json({error:'Duplicate post. can not add the same url twice'})
    }
    res.json(post)
})
} 
exports.list=(req,res)=>{
    Node.find({}).exec((err,posts)=>{
        if(err)console.log(err)
        res.json(posts)
    })

}

exports.removeAll=async(req,res)=>{
    // const {slug}=req.params
    try {
        await Node.deleteMany();
        console.log('All Data successfully deleted');
      } catch (err) {
        console.log(err);
      }
      res.send('all was deleted')
}

  
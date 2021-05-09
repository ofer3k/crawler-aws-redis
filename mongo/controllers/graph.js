
const Graph=require('../models/graph')
exports.create=(req,res)=>{
   console.log(req.body)
const{title}=req.body //req.params

// create
Graph.create({title},(err,post)=>{
    if(err){
        console.log(err)
        res.status(400).json({error:'Duplicate post. try another title'})
    }
    res.json(post)
})
} 
exports.list=(req,res)=>{
    Graph.find({}).exec((err,posts)=>{
        if(err)console.log(err)
        res.json(posts)
    })

}

exports.removeAll=async(req,res)=>{
    // const {slug}=req.params
    try {
        await Graph.deleteMany();
        console.log('All Data successfully deleted');
      } catch (err) {
        console.log(err);
      }
      res.send('all was deleted')
}

  
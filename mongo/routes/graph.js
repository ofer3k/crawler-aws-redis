const router = require('express').Router(); 

// import controllers methods
const {create,list,removeAll}=require('../controllers/graph');

// router.get('/crawl',crawl)
router.post('/post/graph',create)
router.get('/posts/graph',list)
// router.get('/posts/:slug',read)
// router.put('/post/:slug',update)
// router.delete('/posts/:slug',remove)
router.delete('/postsall/graph',removeAll)

module.exports=router
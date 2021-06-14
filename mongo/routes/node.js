const router = require('express').Router(); 

// import controllers methods
const {create,list,removeAll}=require('../controllers/node');

// router.get('/crawl',crawl)
router.post('/node',create)
router.get('/node',list)
router.delete('/node',removeAll)

module.exports=router
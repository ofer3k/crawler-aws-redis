var express = require('express')
const {sendToQueue, worker,purgeAllFromQueue,workerForBigBatch, workerDepth}=require('./aws')
const {removeAllFromRedis,getAllFromRedis}=require('./redis')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.get('/', function (req, res) {
  res.send('api home page')
})

//From the client through the server to the sqs - the first post
router.post('/new-url', function(req, res) {
    var data = req.body;
    console.log('this is the url sent to sqs - ',data);
    // handler(data)
    res.status(200).send('url deliverd')
    // res.send("Dog added!");
    const params = {
      "MessageBody": JSON.stringify({
        'title': 'from client',
        "url":data.url
      }),
      MessageGroupId:'posts',
      "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo"
    };
    sendToQueue(params)
});

// start the crawler
router.post('/worker',async function(req, res) {
  let data=req.body.num
  // console.log(data)
  worker(data)
  res.send('stoped')
});

router.post('/workerForBigBatch',async function(req, res) {
  let data=req.body.num
  // console.log(data)
  workerForBigBatch(data)
  res.send('stoped big batch')
});

router.post('/workerDepth',async function(req, res) {
  let data=req.body.num
  // console.log(data)
  workerDepth(data)
  res.send('stoped depth batch')
});
// get all from redis
router.get('/listRedis',async function(req, res) {
 const a=await getAllFromRedis()
  res.send(a)
});
// remove all from redis 
router.delete('/remove-from-redis',async function(req, res) {
  // 
  removeAllFromRedis()
  // 
  res.send('removed')
});
router.delete('/remove-from-sqs',async function(req, res) {
  // 
  purgeAllFromQueue()
  // 
  res.send('removed')
});


module.exports = router
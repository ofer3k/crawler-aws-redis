var express = require('express')
const {sendToQueue, worker,purgeAllFromQueue}=require('./aws')
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
    console.log('this is the url sent to sqs - ',data.url);
    // handler(data)
    res.status(200).send('url deliverd')
    // res.send("Dog added!");
    const params = {
      "MessageBody": JSON.stringify({
        'title': 'from client',
        "url":data.url
      }),
      "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt"
    };
    sendToQueue(params)
});

// start the crawler
router.get('/worker',async function(req, res) {
  worker()
  res.send('stoped')
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
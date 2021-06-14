var express = require('express')
const axios=require('axios')
const {sendToQueue, worker,purgeAllFromQueue,workerForBigBatch, workerDepth,crawlOverUrl}=require('./aws')
const {removeAllFromRedis,getAllFromRedis}=require('./redis')
var router = express.Router()


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
let isFinished=false

// define the home page route
router.get('/', function (req, res) {
  res.send('api home page')
})
router.get('/workerJob',async function(req, res) {
    await axios.get('http://localhost:8088/api/fetchFromManager')
    .then(async function (response) {
      const {job,id}=response.data
      const {end}=response.data
      if(end){
        isFinished=true
        return
      }
      console.log('index ',id)
      console.log('job ',job)
      const childrens=await crawlOverUrl(job.url)
     await sleep(2000)
      console.log('childrens ',childrens)
    //  need to verify we send the variables in the right order
     axios.post('http://localhost:8088/api/postToManager', {
      sons:childrens,
      index:id,
      father:job.url
    })
    .then((response) => {
      res.send(job,id,childrens)
      console.log('ok from manager')
    }, (error) => {
      console.log(error);
    });
    })
    .catch(function (error) {
      res.send(error)
      console.log(error,' update current phase FROM manager Failed');
    })
  
});
async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  


module.exports = router
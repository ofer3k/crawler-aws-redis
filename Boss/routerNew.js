const { default: axios } = require('axios')
let express = require('express')
let Graph = require("graph-data-structure");
const {merge} =require('merge-anything')
let router = express.Router()
let {sendToPipe,fetchFromPipeline,stopWorking,fetchFromManager,postToManager,purgeAllFromQueue,firstInitial,startWorkers}=require('./contoller')
const {setToRedis,removeAllFromRedis,getAllFromRedis}=require('./redis')

router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
  })


  router.get('/', function (req, res) {
    res.send('api home page')
  })


  router.post('/postToManager',async function(req, res) {
    try {
      console.log(req.body,'req.body')
      const {sons,index,father}=req.body
      // console.log('sons: ',sons,'index: ', index,"father: ", father)
     let isFinished= await postToManager(sons,index,father)
      console.log('post to manager isFinished:',isFinished)
        res.status(200).send(req.body)   
        if(!isFinished){
          axios.get('http://localhost:8085/api/workerJob')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
        }     
    } catch (error) {
        let errMsg=`somthing went wrong!` + ` ${error}`
        res.status(400).send(errMsg)        
    }
  });

  router.get('/fetchFromManager',async function (req, res) {
    try {
      const {job,id} =await fetchFromManager()
      res.status(200).send({job,id})    
    } catch (error) {
    res.status(400).send('fetching from manager went wrong')  
    }
    
  })

  router.delete('/removeAllFromRedis', function(req, res) {
    try {
        removeAllFromRedis()
        res.status(200).send('all redis data was removed')        
    } catch (error) {
        let errMsg=`somthing went wrong!` + ` ${error}`
        res.status(400).send(errMsg)        
    }
  });
  router.delete('/removeAllFromSQS', function(req, res) {
    try {
        purgeAllFromQueue()
        res.status(200).send('all SQS data was removed')        
    } catch (error) {
        let errMsg=`somthing went wrong!` + ` ${error}`
        res.status(400).send(errMsg)        
    }
  });

  router.get('/getAllFromRedis',async function(req, res) {
    try {
        const data=await getAllFromRedis()
        res.status(200).send(data)        
    } catch (error) {
        let errMsg=`somthing went wrong!` + ` ${error}`
        res.status(400).send(errMsg)        
    }
  });



// first initialize pipe with customer url
  router.post('/new-url',async function(req, res) {
    var data =req.body;
    console.log(data)
    let t=data.father==null?'null':data.father
    const {maxDepth,maxPages,numOfWorkers}=data
    const params = {
      "MessageBody": JSON.stringify({
        'title': 'from client',
        "url":data.url,
        "father":t
      }),
      MessageGroupId:'posts',
      "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo"
    };
    try {
       await sendToPipe(params)
        firstInitial(maxDepth,maxPages,numOfWorkers)
        console.log('sleep')
        await sleep(2000)
       await fetchFromPipeline()
       console.log('sleep')
       await sleep(3000)
        if(data.url === undefined) throw new Error('url field was missing');
        res.status(200).send(`added ${data.url} to the pipe`)
        axios.get('http://localhost:8085/api/workerJob')
        .then(function (response) {
          // handle success
          console.log('success from worker');
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })         
    } catch (error) {
        let errMsg=`somthing went wrong!` + ` ${error}`
        res.status(400).send(errMsg)        
    }
    
});

// 

// first initialize pipe with customer url
router.post('/fetchFromPipe', function(req, res) {
  try {
      fetchFromPipeline()
      res.status(200).send(`START fetching from pipe`)        
  } catch (error) {
      let errMsg=`somthing went wrong!` + ` ${error}`
      res.status(400).send(errMsg)        
  }
});

router.post('/stopFetching', function(req, res) {
  try {
    stopWorking()
      res.status(200).send(`STOP fetching from pipe`)        
  } catch (error) {
      let errMsg=`somthing went wrong!` + ` ${error}`
      res.status(400).send(errMsg)        
  }
});

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  
module.exports = router
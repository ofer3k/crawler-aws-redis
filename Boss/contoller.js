const AWS = require("aws-sdk");
const axios=require('axios')
const { Consumer } = require('sqs-consumer');
const { json } = require("body-parser");
const { CodePipeline } = require("aws-sdk");
const {setToRedis,removeAllFromRedis,getAllFromRedis}=require('./redis');
const { response } = require("express");

// aws config and initiallize sqs
AWS.config.update({region:'us-east-1'});
const sqs = new AWS.SQS({apiVersion: "2012-11-05"});
let nextFather=null;
let nextMissionToPushToPipe=0;
let missions=[]
let nodesFromPipe=[]
let numOfAllUrls=0
let urlsInMongo=0
let numOfDepth=0
let maxDepth=3;
let maxPages=30;
let isFinished=false
let numOfWorkers;
const purgeAllFromQueue=function(){
  let params = {
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo' /* required */
  };
  sqs.purgeQueue(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

async function urlDuplicationCheck(sons) {
  const redisData = await getAllFromRedis()
  var newArray = sons.filter(function (el) {
    return !redisData.includes(el)
  }); 

return(newArray)
}
const fetchFromPipe = Consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo',
  batchSize:10,
  handleMessage: async (message) => {
    console.log('with in th handle')
    const data=JSON.parse(message.Body)
    if(!data.father)
    data.father=null
    nodesFromPipe.push({url:data.url,father:data.father})
    if(data.father=='null'){
      nextFather=data.url
      console.log('first father - ',nextFather)
      let saver=JSON.parse(message.Body).url
      let saver2=JSON.parse(message.Body).father
      const firstElement={url:saver,father:saver2}
      await sendToMongo(firstElement)
    }
  }
});  

async function fetchFromPipeline() {  
  console.log('start fetching from pipe')
  fetchFromPipe.start()
}

async function stopWorking() {  
  console.log('STOP fetching from pipe')
  fetchFromPipe.stop()
}

async function fetchFromManager() {
  if(nodesFromPipe.length<1)
  return({job:null,id:null,end:true})

let job=nodesFromPipe.shift()
let id=missions.length
let end='false'
missions[missions.length]='waiting'
return({job,id,end})
}

async function postToManager(sons,index,father) {
 const uniqueSons=await urlDuplicationCheck(sons)
let uniqueSonsWithDad=[]
 uniqueSons.forEach(async (element) => {
  //  console.log(element)
  setToRedis(numOfAllUrls,element)
 uniqueSonsWithDad.push({url:element,father:father})
 numOfAllUrls++
 });
 missions[index]=uniqueSonsWithDad

while(missions[nextMissionToPushToPipe]!='waiting' && missions[nextMissionToPushToPipe]!=undefined)
{
  console.log('in the while')
  let c=0;
  for (let i = 0; i < missions[nextMissionToPushToPipe].length; i++) {
    let element=missions[nextMissionToPushToPipe][i]
    c++
  console.log(c)
  console.log(element)
  // check for depth
  if(nextFather===element.father)
    {
      numOfDepth++
     nextFather=element.url
    }
// check for limits
    if(numOfDepth>=maxDepth||urlsInMongo>=maxPages-1)
    {
      stopWorking()
      console.log('limits!!!!')
      isFinished=true;
      break
    }else{
      const params = {
              "MessageBody": JSON.stringify({
                "url":element.url,
                "father":element.father
              }),
              MessageGroupId:'posts',
              "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo"
            };  
            console.log('not maximum')
             await sendToPipe(params) 
             await sendToMongo(element)
      urlsInMongo++
      console.log(urlsInMongo,maxPages,'not limit')
    }

  }
  // missions[nextMissionToPushToPipe].forEach(async (element) => {

  //   if(nextFather===element.father)
  //   {
  //     console.log('next and father are ===')
  //    numOfDepth++
  //    nextFather=element.url
  //   }

  //   if(numOfDepth>=maxDepth||urlsInMongo>=maxPages)
  //   {
  //     // missions[nextMissionToPushToPipe].length=0
  //     isFinished= true
  //     console.log('maximum')
  //     stopWorking()
  //     console.log('numOfDepth',numOfDepth)
  //     console.log('urlsInMongo',urlsInMongo)
  //   }else{
  //     console.log('keep running')
  //     const params = {
  //       "MessageBody": JSON.stringify({
  //         "url":element.url,
  //         "father":element.father
  //       }),
  //       MessageGroupId:'posts',
  //       "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo"
  //     };  
  //     console.log('not maximum')
  //      await sendToPipe(params) 
  //      await sendToMongo(element)
  //      await sleep(1000)
  //   }
  // });
  missions[nextMissionToPushToPipe]='end'
  nextMissionToPushToPipe++
return isFinished
 
}  
    return true
  }

//   function to send to pipeline
  const sendToPipe=async function(params){
     sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log("There was an Error: ", err);
      } else {
        console.log("Successfully added message to queue", data.MessageId);
      }
    });
  }

  const sendToMongo=async function(params){
    const {url,father}=params
    console.log(urlsInMongo,'===',maxPages)
    if(urlsInMongo<maxPages)
    {
    await axios.post('http://localhost:8001/api/mongo/node', {
        url,
        father
      })
      .then(async (response) => {
        await sleep(1000)
        console.log('ok from mongo');
      }, (error) => {
        // console.log(error);
      });
    }
 }
  async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

  const firstInitial=async function(maxDepthFromClient,maxPagesFromClient,numOfWorkersFromClient){
   maxDepth=parseInt(maxDepthFromClient) 
   maxPages=parseInt(maxPagesFromClient)   
   numOfWorkers=numOfWorkersFromClient
 }

 const startWorkers=async function(){
  //  tell a worker to start work
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


module.exports = {
    sendToPipe,
    fetchFromPipeline,
    stopWorking,
    fetchFromManager,
    postToManager,
    purgeAllFromQueue,
    firstInitial,
    startWorkers
   };



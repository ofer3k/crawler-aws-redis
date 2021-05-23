const { default: axios } = require('axios')
let express = require('express')
// import { merge } from 'merge-anything'
let Graph = require("graph-data-structure");
const {merge} =require('merge-anything')
// const {sendToQueue, worker,purgeAllFromQueue,workerForBigBatch, workerDepth}=require('./aws')
// const {removeAllFromRedis,getAllFromRedis}=require('./redis')
let router = express.Router()

// graph's info
let graphToMongo;
let graphToMongoNodes={};
let graphToMongoLinks={};
let klein = Graph();
// limits from client
let numOfWorkers1;
let maxPages1;
let maxDepth1;
// update from workers
let currentNumberOfDepth=0;
let currentNumberOfNodes=0;

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
// router.post('/new-url', function(req, res) {
//     var data = req.body;
//     console.log('this is the url sent to sqs - ',data);
//     // handler(data)
//     res.status(200).send('url deliverd')
//     // res.send("Dog added!");
//     const params = {
//       "MessageBody": JSON.stringify({
//         'title': 'from client',
//         "url":data.url
//       }),
//       MessageGroupId:'posts',
//       "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo"
//     };
//     sendToQueue(params)
// });

// start the crawler
// router.post('/worker',async function(req, res) {
//   let data=req.body.num
//   // console.log(data)
//   worker(data)
//   res.send('stoped')
// });

// router.post('/workerForBigBatch',async function(req, res) {
//   let data=req.body.num
//   // console.log(data)
//   workerForBigBatch(data)
//   res.send('stoped big batch')
// });

// router.post('/workerDepth',async function(req, res) {
//   let data=req.body.num
//   let maxPages=req.body.maxPages
//   let numWorkers=req.body.numWorkers
//   // console.log(data)
//   workerDepth(data,maxPages,numWorkers)
//   res.send('stoped depth batch')
// });
// get all from redis
// router.get('/listRedis',async function(req, res) {
//  const a=await getAllFromRedis()
//   res.send(a)
// });
// remove all from redis 
// router.delete('/remove-from-redis',async function(req, res) {
//   // 
//   removeAllFromRedis()
//   // 
//   res.send('removed')
// });
// router.delete('/remove-from-sqs',async function(req, res) {
//   // 
//   purgeAllFromQueue()
//   // 
//   res.send('removed')
// });
// ---------------------------------------------------------------------------
// start from client
router.post('/stratFromClient',async function(req, res) {
  
  maxPages1=req.body.maxPages;
  maxDepth1=req.body.num;
  numOfWorkers1=req.body.numWorkers;
  console.log(`client's limits - `,`
  max pgaes : ${maxPages1}
  max depth : ${maxDepth1}
  number of workers : ${numOfWorkers1}`)
  // sending max page & deep to initial worker
  let send=req.body
  await axios.post('http://localhost:8083/api/workerDepth', {
    body:send
  })
  res.status(200).send({
    information:'request got from client, the manager is updated and a worker will begin to work'
  })
});

// updates from worker
   // only for dev to get alert from worker
router.post('/workerHaveStarted',async function(req, res) {
  // console.log(req.body)
  res.status(200).send({information:'the job riched to the worker'})
});

router.post('/workerUpdate',async function(req, res) {
  console.log('update')
    graphToMongoNodes = {...graphToMongoNodes,...req.body.update.nodes}
  // merge data that came from worker with existing data
  let evolution = merge(graphToMongoNodes, req.body.update.nodes)
  let evolution2 = merge(graphToMongoLinks, req.body.update.links)
  graphToMongoLinks = {...graphToMongoLinks,...req.body.update.links}
  graphToMongo={nodes:evolution,links:evolution2}

  //numbers of URL's all workers have collected 
 currentNumberOfNodes=Object.keys(evolution).length
if(currentNumberOfNodes>maxPages1){
  console.log('max pages')
}
res.status(200).send({information:'the manager was updated'})
});

// add edge to graph
router.post('/addEdge',async function(req, res) {
  klein.addEdge(req.body.currentURL,req.body.currentLink);
  currentNumberOfDepth=klein.shortestPath('https://www.youtube.com/',req.body.currentURL).length
  console.log('depth by manager graph - ',currentNumberOfDepth)
  res.status(200).send({information:'added the edge to the graph'})
});
// 

router.post('/workerFinishedEnd',async function(req, res) {
  let nodesFinal = graphToMongo.nodes.splice(0, maxPages1)
  let linksFinal = graphToMongo.links.splice(0, maxPages1+1)
  let graphAfterCut={nodes:nodesFinal,links:linksFinal}
  let graphToMongo1=JSON.stringify(graphAfterCut)
  
  // console.log('end')
  await axios.post('http://localhost:8001/api/mongo/post/graph', {
    title:graphToMongo1
  })
  res.status(200).send({information:'sent graph to mongo'})
});

// updates To worker
router.get('/workerHaveStarted',async function(req, res) {
  
  res.status(200).send({information:'alot of info'})
});

router.get('/workerUpdate',async function(req, res) {
// update the current number of nodes and depth;
  res.status(200).send({currentNumberOfNodes,currentNumberOfDepth})
});







module.exports = router
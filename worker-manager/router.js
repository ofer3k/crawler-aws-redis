const { default: axios } = require('axios')
let express = require('express')
let Graph = require("graph-data-structure");
const {merge} =require('merge-anything')
let router = express.Router()

let rootURL; 

// graph's info
let graphToMongo;
let graphToMongoNodes={};
let graphToMongoLinks={};
// for merging the manager graph with the worker's graph
let evolutionNodes={};
let evolutionLinks={};
let klein = Graph();
// limits from client
let numOfWorkers1;
let maxPages1;
let maxDepth1;
// updates from workers
let currentNumberOfDepth=0;
let currentNumberOfNodes=0;
let isWorking=0;
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.get('/', function (req, res) {
  res.send('api home page')
})

// From the client through the server to the sqs - the first post
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
// ---------------------------------------------------------------------------
// start from client
router.post('/stratFromClient',async function(req, res) {
  rootURL=req.body.url
  maxPages1=req.body.maxPages;
  maxDepth1=req.body.num;
  numOfWorkers1=req.body.numWorkers;
  graphToMongoNodes={id:rootURL}
  console.log(`client's limits - `,`
  max pgaes : ${maxPages1}
  max depth : ${maxDepth1}
  number of workers : ${numOfWorkers1}
  root url : ${rootURL}
  graph to mongo nodes : ${graphToMongoNodes.id}`)
  // sending max page & deep to initial worker (just for extra check)
  let firstInitialWorker=req.body
  isWorking++
    await axios.post('http://localhost:8083/api/workerDepth', {
      body:firstInitialWorker
    })  
    console.log('is working - ',isWorking)

  if(numOfWorkers1==2)
  {
    console.log('you asked for two worker')
    isWorking++
    await axios.post('http://localhost:8085/api/workerDepth', {
      body:firstInitialWorker
    })  
    console.log('is working - ',isWorking)

  }
   
  res.status(200).send({
    information:'request got from client, the manager is updated and a worker will begin to work'
  })
});

// updates from worker
   // only for dev to get alert from worker
// router.post('/workerHaveStarted',async function(req, res) {
//   // console.log(req.body)
//   res.status(200).send({information:'the job riched to the worker'})
// });

// after full batch - updating the manager
router.post('/workerUpdate',async function(req, res) {
  console.log('update')

    // graphToMongoNodes = {...graphToMongoNodes,...req.body.update.nodes}
    // graphToMongoLinks = {...graphToMongoLinks,...req.body.update.links}
  // merge data that came from worker with existing data
   evolutionNodes = merge(evolutionNodes, req.body.update.nodes)
   evolutionLinks = merge(evolutionLinks, req.body.update.links)
  
if(evolutionNodes[0].id==rootURL)
{
  graphToMongo={nodes:evolutionNodes,links:evolutionLinks}
  console.log(graphToMongo.nodes)
}
  //numbers of URL's all workers have collected 
 currentNumberOfNodes=Object.keys(evolutionNodes).length
res.status(200).send({information:'the manager was updated'})
});

// add edge to graph
router.post('/addEdge',async function(req, res) {
  klein.addEdge(req.body.currentURL,req.body.currentLink);
  // Updating the depth
  currentNumberOfDepth=klein.shortestPath(rootURL,req.body.currentURL).length
  console.log('depth by manager graph - ',currentNumberOfDepth)
  res.status(200).send({information:'added the edge to the graph'})
});

// When boundaries are reached, the worker updates the manager that his work has ended
router.post('/workerFinishedEnd',async function(req, res) {
  console.log('is working - ',isWorking)
  isWorking--
  console.log(graphToMongo.nodes[0].id,rootURL,isWorking)
  if(isWorking<0 
    // && rootURL==graphToMongo.nodes[0].id
    ){
    console.log('after if check!!!',graphToMongo.nodes[0].id)
// Double verification that the displayed graph does not exceed the defined limits
let tempNodes=graphToMongo.nodes
let tempLinks=graphToMongo.links
// using temp to not splice the original data (needs to be save for more than one worker)
let nodesFinal = tempNodes.splice(0, maxPages1)
let linksFinal = tempLinks.splice(0, maxPages1+1)
let graphAfterCut={nodes:nodesFinal,links:linksFinal}
// stringify for mongoDB
let graphToMongo1=JSON.stringify(graphAfterCut)
try {
  await axios.post('http://localhost:8001/api/mongo/post/graph', {
    title:graphToMongo1
  })  
} catch (error) {
  res.status(400).send(error,{information:'graph FAILED'})
}

  }
  
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
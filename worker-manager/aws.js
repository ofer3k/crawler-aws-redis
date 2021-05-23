// // Load the AWS SDK for Node.js
// const AWS = require("aws-sdk");
// const axios=require('axios')
// var Graph = require("graph-data-structure");

// const {setToRedis,getAllFromRedis}=require('./redis')
// const { Consumer } = require('sqs-consumer');
// const got = require('got');
// const jsdom = require("jsdom");
// const { json } = require("body-parser");
// const { JSDOM } = jsdom;


// AWS.config.update({region:'us-east-1'});
// const sqs = new AWS.SQS({apiVersion: "2012-11-05"});



// // purge queue
// const purgeAllFromQueue=function(){
//   let params = {
//     QueueUrl: 'https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo' /* required */
//   };
//   sqs.purgeQueue(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response
//   });
// }


// // By using Callback
// const sendToQueue=function(params){
//   sqs.sendMessage(params, (err, data) => {
//     if (err) {
//       console.log("There was an Error: ", err);
//     } else {
//       console.log("Successfully added message to queue", data.MessageId);
//     }
//   });
// }

// let currentURL;
// let currntLinks=[];

// const workerForBigBatch=async function(num){
//   let numberOfPagesFromClient=Number(num) ;
//   sleep(200)
//   console.log(numberOfPagesFromClient)
//   // console.log(num, 'number from client into worker func')
//   let i=0;
//       pollFromSQSBig.start()
//       pollFromSQSBig.on('response_processed',async () => {
//         i++
//         console.log(i)
//         console.log(numberOfPagesFromClient,'numberOfPagesFromClient')
        
//         if(i===numberOfPagesFromClient)
//         {
//          pollFromSQSBig.stop()
//           i=0
//           numberOfPagesFromClient=0
//          console.log('max ',numberOfPagesFromClient)
//         }
//        await sleep(2000)
//        }); 
//   }

//   // start
//   const pollFromSQSBig = Consumer.create({
//     queueUrl: 'https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo',
//     batchSize:10,
//     handleMessage: async (message) => {
//         // console.log(message.Body);
//         let redisData=await getAllFromRedis()
//         console.log('redis data',redisData)
//         currentURL=(JSON.parse(message.Body).url)
//         const vgmUrl=JSON.parse(message.Body).url
//         // 
//         const isMidi = (link) => {
//           // Return false if there is no href attribute.
//           if(typeof link.href === 'undefined') { return false }
        
//           return link.href.includes('http');
//         };
//         const noParens = (link) => {
//           // Regular expression to determine if the text has parentheses.
//           const parensRegex = /^((?!\().)*$/;
//           return parensRegex.test(link.textContent);
//         };
        
//         (async () => {
          
//           const response = await got(vgmUrl);
//           const dom = new JSDOM(response.body);
        
//           // Create an Array out of the HTML Elements for filtering using spread syntax.
//           const nodeList = [...dom.window.document.querySelectorAll('a')];
        
//           nodeList.filter(isMidi).filter(noParens).forEach(link => {
//             // 
           
//             let params = {
//               "MessageBody": JSON.stringify({
//                 'title': 'from client',
//                 "url":link.href
//               }),
//               MessageGroupId:'posts',
//               "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo"
//             };
           
//             if(!redisData.includes(link.href)){
//               currntLinks.push(link)
//               console.log(currntLinks)
//               sqs.sendMessage(params, (err, data) => {
//                 if (err) {
//                   console.log("There was an Error: ", err);
//                 } else {
//                   console.log("Successfully added message to queue", data.MessageId);
//                   setToRedis(data.MessageId,link.href)
//                   console.log('and added to redis')
//                 }
//               });
//             }
//             else{
//               console.log('this link is already in redis')
//             }
  
//           });
//         })();
        
//         console.log('current url:',currentURL)
//   // current url: [ 'https://www.youtube.com/about/copyright/' ]
//   let mongodata={
//   title:currentURL
//   }
//   // console.log(JSON.stringify(mongodata))
//   // 
  
//    axios.post('http://localhost:8001/api/mongo/post', {
//     title: currentURL,
//     childrens:[1,2,3,4]
//   })
//   .then((response) => {
//     // console.log(response);
//   }, (error) => {
//     console.log(error);
//   });
//     },
//     sqs: new AWS.SQS()
//   });
//   // end
  
// let obj={
//   url:'ofer',
//   childerns:[]
// }
// var maxUrls=0;
// var depth=0
// var pages=0
// const worker=async function(num){

// let numberOfPagesFromClient=Number(num) ;
// sleep(200)
// console.log(numberOfPagesFromClient)
// if (depth===num)
// {
//   pollFromSQS.stop()
// }
//     let i=0;
//     pollFromSQS.start()
//     pollFromSQS.on('response_processed',async () => {
//       i++
//       console.log(i)
//       console.log(numberOfPagesFromClient,'numberOfPagesFromClient')
      
//       if(i===numberOfPagesFromClient)
//       {
//        pollFromSQS.stop()
//         i=0
//         numberOfPagesFromClient=0
//        console.log('max ',numberOfPagesFromClient)
//       }
//      await sleep(2000)
//      }); 
// }
// var klein = Graph();
// // 
// const pollFromSQS = Consumer.create({
//   queueUrl: 'https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo',
//   batchSize:1,
//   handleMessage: async (message) => {
//       let redisData=await getAllFromRedis()
//       // the site right now - from sqs message
//       currentURL=(JSON.parse(message.Body).url)
//       const vgmUrl=JSON.parse(message.Body).url

//       const isMidi = (link) => {
//         // Return false if there is no href attribute.
//         if(typeof link.href === 'undefined') { return false }
      
//         return link.href.includes('http');
//       };
//       const noParens = (link) => {
//         // Regular expression to determine if the text has parentheses.
//         const parensRegex = /^((?!\().)*$/;
//         return parensRegex.test(link.textContent);
//       };
      
//       (async () => {
//         const response = await got(vgmUrl);
//         const dom = new JSDOM(response.body);
      
//         // Create an Array out of the HTML Elements for filtering using spread syntax.
//         const nodeList = [...dom.window.document.querySelectorAll('a')];
      
//         nodeList.filter(isMidi).filter(noParens).forEach(link => {
//           //
//           let params = {
//             "MessageBody": JSON.stringify({
//               'title': 'from client',
//               "url":link.href
//             }),
//             MessageGroupId:'posts',
//             "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo"
//           };
//           if(!redisData.includes(link.href)){
//           console.log('father',currentURL, 'kid', link.href,)
//         klein.addEdge(currentURL, link.href);
//            sqs.sendMessage(params,async (err, data) => {
//               if (err) {
//                 console.log("There was an Error: ", err);
//               } else {
//                 console.log("Successfully added message to queue", data.MessageId);
//                 setToRedis(data.MessageId,link.href)
//                 console.log('and added to redis')
//               }
//             });
//           }
//           else{
//             console.log('this link is already in redis')
//           }
//         })
//      depth=klein.shortestPath('https://www.youtube.com/',currentURL).length
//      console.log('depth - ',depth)
//         // await sleep(2000)
//         axios.post('http://localhost:8001/api/mongo/post', {
//           title: currentURL,
//           // childrens:[]
//         })
//         .then((response) => {
//           // console.log('topo ',klein.shortestPath('https://www.youtube.com/',currentURL))
//           // console.log('topo ',klein.shortestPath('https://www.youtube.com/',currentURL).length)
//         }, (error) => {
//           console.log(error);
          
//         });
        
        
//       })();

//       console.log('current url:',currentURL)
//       console.log(obj)

 
//   },
//   sqs: new AWS.SQS()
 
// });
// // depth worker
// const workerDepth=async function(num,maxPages,numWorkers){
  
//   let maxDepth=Number(num) ;
//   let maxPages1=Number(maxPages);
//   let numWorkers1=Number(numWorkers) ;
//   // console.log(maxDepth, ' - max depth')
//   sleep(200)
//   console.log('max depth - ',maxDepth)
//   console.log('max pages - ',maxPages1)
//   console.log('number of workers - ',numWorkers1)


// //  number of workers
//   for(let i=0;i<numWorkers;i++)
//   {
//     console.log('worker - ' ,i)
//     pollFromSQSDepth.start()
//   }
//       // every time a worker finishes its current round
//       pollFromSQSDepth.on('response_processed',async () => {

//         pages++
//         console.log('page - ',pages)
//         if (depth>maxDepth || maxUrls>maxPages1)
//         {
//           pollFromSQSDepth.stop()
//           let nodes = klein.serialize().nodes.splice(0, maxPages1)
//           let links = klein.serialize().links.splice(0, maxPages1)
//           let graphAfterCut={nodes,links}

//           let kleinJson=JSON.stringify(klein.serialize().nodes)
//           let nodesAfterCut=JSON.stringify(graphAfterCut)
//           console.log(nodesAfterCut)
//           axios.post('http://localhost:8001/api/mongo/post/graph', {
//           title: nodesAfterCut,
//           // childrens:[]
//         })
//         .then((response) => {
//           // console.log('topo ',klein.shortestPath('https://www.youtube.com/',currentURL))
//           // console.log('topo ',klein.shortestPath('https://www.youtube.com/',currentURL).length)
//         }, (error) => {
//           console.log(error);
          
//         });
          
//         }
        
//        await sleep(2000)
//        }); 
//   }



// //depth worker poll 
// const pollFromSQSDepth = Consumer.create({
//   queueUrl: 'https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo',
//   batchSize:1,
//   handleMessage: async (message) => {
//     console.log('start')
//       let redisData=await getAllFromRedis()
//       // the site right now - from sqs message
//       currentURL=(JSON.parse(message.Body).url)
//       const vgmUrl=JSON.parse(message.Body).url

//       const isMidi = (link) => {
        
//         // Return false if there is no href attribute.
//         if(typeof link.href === 'undefined') { return false }
      
//         return link.href.includes('http');
//       };
//       const noParens = (link) => {
//         // Regular expression to determine if the text has parentheses.
//         const parensRegex = /^((?!\().)*$/;
//         return parensRegex.test(link.textContent);
//       };
      
//       (async () => {
//         const response = await got(vgmUrl);
//         const dom = new JSDOM(response.body);
      
//         // Create an Array out of the HTML Elements for filtering using spread syntax.
//         const nodeList = [...dom.window.document.querySelectorAll('a')];
      
//         nodeList.filter(isMidi).filter(noParens).forEach(link => {
//           //
          
//           let params = {
//             "MessageBody": JSON.stringify({
//               'title': 'from client',
//               "url":link.href
//             }),
//             MessageGroupId:'posts',
//             "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt2.fifo"
//           };
//           if(!redisData.includes(link.href)){
//             maxUrls++
//           console.log('father',currentURL, 'kid', link.href,)
//         klein.addEdge(currentURL, link.href);
//            sqs.sendMessage(params,async (err, data) => {
//               if (err) {
//                 console.log("There was an Error: ", err);
//               } else {
//                 console.log("Successfully added message to queue", data.MessageId);
//                 setToRedis(data.MessageId,link.href)
//                 console.log('and added to redis')
//               }
//             });
//           }
//           else{
//             console.log('this link is already in redis')
//           }
//         })
//      depth=klein.shortestPath('https://www.youtube.com/',currentURL).length
//      console.log('depth - ',depth)
//         // await sleep(2000)
//         axios.post('http://localhost:8001/api/mongo/post', {
//           title: currentURL,
//           // childrens:[]
//         })
//         .then((response) => {
//           // console.log('topo ',klein.shortestPath('https://www.youtube.com/',currentURL))
//           // console.log('topo ',klein.shortestPath('https://www.youtube.com/',currentURL).length)
//         }, (error) => {
//           console.log(error);
          
//         });
        
        
//       })();
//   },
//   sqs: new AWS.SQS()
 
// });



// // 

// async function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }  
// module.exports = {
//  sendToQueue,
//  worker,
//  purgeAllFromQueue,
// workerForBigBatch,
// workerDepth

// };
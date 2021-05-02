// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const {setToRedis,getAllFromRedis}=require('./redis')
const { Consumer } = require('sqs-consumer');
const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


AWS.config.update({region:'us-east-1'});
const sqs = new AWS.SQS({apiVersion: "2012-11-05"});

// 

// 

// purge queue
const purgeAllFromQueue=function(){
  let params = {
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/562608490795/ttt' /* required */
  };
  sqs.purgeQueue(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}


// By using Callback
const sendToQueue=function(params){
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log("There was an Error: ", err);
    } else {
      console.log("Successfully added message to queue", data.MessageId);
    }
  });
}

const worker=function(){
  let currentURL=[]
  const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/562608490795/ttt',
    batchSize:10,
    handleMessage: async (message) => {
        // console.log(message.Body);
        let redisData=await getAllFromRedis()
        console.log('redis data',redisData)
        currentURL.push(JSON.parse(message.Body).url)
        const vgmUrl=JSON.parse(message.Body).url
        // 
        const isMidi = (link) => {
          // Return false if there is no href attribute.
          if(typeof link.href === 'undefined') { return false }
        
          return link.href.includes('http');
        };
        const noParens = (link) => {
          // Regular expression to determine if the text has parentheses.
          const parensRegex = /^((?!\().)*$/;
          return parensRegex.test(link.textContent);
        };
        
        (async () => {
          const response = await got(vgmUrl);
          const dom = new JSDOM(response.body);
        
          // Create an Array out of the HTML Elements for filtering using spread syntax.
          const nodeList = [...dom.window.document.querySelectorAll('a')];
        
          nodeList.filter(isMidi).filter(noParens).forEach(link => {
            // 
            let params = {
              "MessageBody": JSON.stringify({
                'title': 'from client',
                "url":link.href
              }),
              "QueueUrl": "https://sqs.us-east-1.amazonaws.com/562608490795/ttt"
            };
           
            if(!redisData.includes(link.href)){
              sqs.sendMessage(params, (err, data) => {
                if (err) {
                  console.log("There was an Error: ", err);
                } else {
                  console.log("Successfully added message to queue", data.MessageId);
                  setToRedis(data.MessageId,link.href)
                  console.log('and added to redis')
                }
              });
            }
            else{
              console.log('this link is already in redis')
            }

          });
        })();
        // 
        
        app.stop()
        console.log('current url:',currentURL)
    },
    sqs: new AWS.SQS()
});
app.start()

}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  
module.exports = {
 sendToQueue,
 worker,
 purgeAllFromQueue
 
};
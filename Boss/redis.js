const redis = require("redis");

const client = redis.createClient({
    // host: 'redis-10116.c265.us-east-1-2.ec2.cloud.redislabs.com',
    // port: 10116,
    // password: 'vQnsQdSp6AEBIW0NtqCEe8bnOFoBAQpC'
    port      : 6379,               // replace with your port
    host      : '127.0.0.1', 
});


client.on("error", (err) => {
    console.log(err);
})

// post and read
const setToRedis=function(key,value){
    client.set(key, value, function(err, reply) {
        // console.log(reply);
      });
}

const getFromRedis=function(key){
    client.get(key, function(err, reply) {
        console.log(reply);
    });
}
const getAllFromRedis=async function(){
    let values=[]
    client.keys("*", function(e, keys){
        if(e)console.log(e);

        keys.forEach(function (key) {
            client.get(key, function (err, value) {
               
                // console.log(value)
                values.push(value)
            });
        });
        
    });
    await sleep(2000)
    // console.log('vvv' ,values)
    return values
}


const cachingFromRedis=function(key){
    const searchTerm = key;
    try {
        client.get(searchTerm, async (err, jobs) => {
            if (err) throw err;
            if (jobs) {
                console.log(jobs)
                return({
                    jobs: JSON.parse(jobs),
                    message: "data retrieved from the cache",
                });    
            }
            else {
                // const jobs = await axios.get(`https://jobs.github.com/positions.json?search=${searchTerm}`);
                
                // client.setex(searchTerm, 600, JSON.stringify(jobs.data));
                return({
                    jobs: jobs.data,
                    message: "cache miss"
                });
            }
        });
    } catch(err) {
        return({message: err.message});
    }
}
// let a=[]
// const main=async function(){
//    a=await getAllFromRedis()  
//    console.log(a)
// }
// main()
const removeAllFromRedis=function(){
    client.flushdb( function (err, succeeded) {
        console.log(succeeded); // will be true if successfull
    });
}


async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

module.exports = {
    getAllFromRedis,
    setToRedis,
    removeAllFromRedis
   };
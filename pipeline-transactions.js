//pub/sub -> similar to the concept of sockets
//pub-> send a message to a channel
//sub->receives/consume a message from a channel

import redis from "redis";

const client = redis.createClient({
  host: "localhost", // this means the redis server is now hosted on local host
  port: 6379, // default port that the redis server will use
});

client.on("error", (error) => console.log("Redis client error occured", error));

async function pipeliningAndTransactions(params) {
  try {
    await client.connect();

    //pipelining and transaction
    //Pipeling in redis is a technique of sending multiple commands to redis server in a batch
    //Transaction in redis allow to be executed as a single unit - basically executing multiple commands as a single unit
    //real time scenario ex: when we are doing batch data insertions -  example logging events or how many times user has logged to a site
    //when banking transactions happen i.e we want both to execute without fail  so in these scenarios we can use transactions

    const multi = client.multi();
    // all these multi commands can be executed one by one.

    multi.set("key-transaction1", "value1");
    multi.set("key-transaction2", "value1");
    multi.get("key-transaction1");
    multi.get("key-transaction2");

    const results = await multi.exec();
    console.log("piplelineResults1", results); //o/p: [ 'OK', 'OK', 'value1', 'value1' ] so both setting and getting oupts are shown in array

    //multi() starts a pipeline (aka transactional block in Redis).

    //The commands (set and get) are queued up.

    //exec() sends all commands to Redis in one go.

    //pipelineresults will be an array of results in the  order the commands were added.
    const pipeline = client.multi();

    pipeline.set("key-pipeline1", "value1");
    pipeline.set("key-pipeline2", "value2");
    pipeline.get("key-pipeline1");
    pipeline.get("key-pipeline2");

    const pipelineresults = await pipeline.exec();

    console.log("piplelineResults -2 ", pipelineresults);

    //batch operation
    const batchOperatn = client.multi();
    for (let i = 0; i < 1000; i++) {
      batchOperatn.set(`user:${i}:action`, `$Action ${i}`);
    }
    const results3 = await batchOperatn.exec();
    // console.log("piplelineResults -3 ", results3);
  } catch (error) {
    console.log("Error", error);
  } finally {
    await client.quit();
  }
}

pipeliningAndTransactions();

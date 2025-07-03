import redis from "redis";

// create a client :  this client is used to interact with the redis server

const client = redis.createClient({
  host: "localhost", // this means the redis server is now hosted on local host
  port: 6379, // default port that the redis server will use
});

// we will add event listener which will log to console if there is any error
client.on("error", (error) => console.log("Redis client error occured", error));

//simple function to test our redis connection

async function testRedisConnection() {
  try {
    await client.connect();
    console.log("client is now connected to redis server");
    //set and get values
    await client.set("name", "value-ChaithuMa");

    const extractValue = await client.get("key");
    console.log(extractValue);

    const deleteCount = await client.del("name");
    console.log(deleteCount);
    const extractUpdatedValue = await client.get("name");
    console.log(extractUpdatedValue); // will return null cz name key is already deleted

    await client.set("count", 100);
    const incrementCount = await client.incr("count");
    console.log("Incremented count value", incrementCount);
    const decrementCount = await client.decr("count");
    console.log("decrement count value", decrementCount);
  } catch (error) {
    console.log("Error---", error);
  } finally {
    await client.quit(); // this helps in avoiding the open connections
  }
}

testRedisConnection();

import redis from "redis";

// create a client :  this client is used to interact with the redis server

const client = redis.createClient({
  host: "localhost", // this means the redis server is now hosted on local host
  port: 6379, // default port that the redis server will use
});

client.on("error", (error) => console.log("Redis client error occured", error));

async function redisDataStructures(params) {
  try {
    await client.connect();
    //strings - set, get, mSet- for setting multiple key value pairs at once, mG et- for getting multiple key value pairs at once
    await client.set("user:name", "Chaitanya Vadthya");
    const name = await client.get("user:name");
    console.log("Name---", name);

    await client.mSet([
      "user:email",
      "vadthyachaitanya@gmail.com",
      "user:age",
      "25",
      "user:contact",
      "9381093270",
    ]);
    const userDetails = await client.mGet(
      "user:email",
      "user:age",
      "user:contact"
    );
    console.log("USER DETAILS--", userDetails);

    //LISTS - LPUSH(pushes item to the start of list), RPUSH(pushes item to the END of list)
    //LRANGE(retrieves elements from specific range), LPOP(removes element from start and returns), RPOP(removes from right and returns)

    // await client.lPush("notes", ["note1", "note2", "note3"]);
    const extractAllNotes = await client.lRange("notes", 0, -1);
    console.log("extractAllNotes", extractAllNotes);
    const firstNote = await client.lPop("notes");
    console.log("first note after pop", firstNote);

    const remainingNotes = await client.lRange("notes", 0, -1);
    console.log("remainingNotes", remainingNotes);
  } catch (error) {
    console.log("Error", error);
  } finally {
    await client.quit();
  }
}

redisDataStructures();

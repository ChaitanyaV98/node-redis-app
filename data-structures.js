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
    //const extractAllNotes = await client.lRange("notes", 0, -1);
    //console.log("extractAllNotes", extractAllNotes);
    // const firstNote = await client.lPop("notes");
    // console.log("first note after pop", firstNote);

    //await client.lPush("notes", ["note2", "note3", "note4"]);
    // await client.rPush("notes", "notes5");
    // await client.rPush("notes", ["notes6", "notes7"]);
    // const remainingNotes = await client.lRange("notes", 0, -1);
    // console.log("remainingNotes", remainingNotes);

    //SETS- SADD(adds one or more members to a set)
    //SMembers - returns all the elements of a set
    //SISMEMBER - Checks if item is a member of set
    //SREM - to remove one or more members of a set

    await client.sAdd("user:nickname", ["john", "varun", "xyz"]);

    const isVarunOfUserNickName = await client.sIsMember(
      "user:nickname",
      "varun"
    );
    console.log("isVarunOfUserNickName", isVarunOfUserNickName);
    const removeXyz = await client.sRem("user:nickname", "xyz");
    console.log("removeXyz", removeXyz);
    const extractUserNickNames = await client.sMembers("user:nickname");
    console.log("extractUserNickNames", extractUserNickNames);

    // we will work with sorted sets -> sorted sets are those which has a score associated each item, redis will maintain the order of the items based on score given to it
    //sorted sets are helpful for leader boards, priority que
    //ZAdd- this will add elements with score to a set
    //ZRANGE will give the range of elements
    //ZRANK - Gives the rank of a particular element or it'll give position
    await client.zAdd("cart", [
      {
        score: 100,
        value: "Cart 1", // score is now associated for the cart1
      },
      {
        score: 150,
        value: "Cart 2",
      },
      {
        score: 10,
        value: "Cart 3",
      },
    ]);
    const getCartItems = await client.zRange("cart", 0, -1); // when we pass 0,-1 as the range, it will retrieve all the items in the list
    console.log("result of get cart items with the range", getCartItems);

    const extractAllCartItemsWithScore = await client.zRangeWithScores(
      // will return array with each having score as well
      "cart",
      0,
      -1
    );
    console.log(extractAllCartItemsWithScore);

    const cartTwoRank = await client.zRank("cart", "Cart 2");
    console.log("Cart two rank", cartTwoRank);

    //hashes -> HSET, HGET, HGETALL, HDEL

    await client.hSet("product1", {
      name: "Product 1",
      description: "Product one description",
      rating: "10",
    });

    const getProductRating = await client.hGet("product1", "rating");
    console.log("GET PRODUCT RATING", getProductRating);

    const getProductDetails = await client.hGetAll("product1");
    console.log("all prod details", getProductDetails);
    await client.hDel("product:1", "rating");
    const updatedProductDetails = await client.hGetAll("product1");
    console.log("updatedProductDetails", updatedProductDetails);
  } catch (error) {
    console.log("Error", error);
  } finally {
    await client.quit();
  }
}

redisDataStructures();

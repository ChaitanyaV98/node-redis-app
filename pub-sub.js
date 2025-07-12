import redis from "redis";

const client = redis.createClient({
  host: "localhost", // this means the redis server is now hosted on local host
  port: 6379, // default port that the redis server will use
});

client.on("error", (error) => console.log("Redis client error occured", error));

async function testAdditionalFeatures(params) {
  try {
    await client.connect();
    const subscriber = client.duplicate(); // create a new connection
    await subscriber.connect(); //shares common connection

    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`recieved message from ${channel}:${message}`);
    });

    //publish a message to the subscriber
    await client.publish(
      "dummy-channel",
      "sending FIRST message to the dummy channel from publisher"
    );
    await client.publish(
      "dummy-channel",
      "sending SECOND message to the dummy channel from publisher"
    );

    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 sec before closing he connection
    await subscriber.quit(); //close the subscriber connection
  } catch (error) {
    console.log("Error", error);
  } finally {
    await client.quit();
  }
}
testAdditionalFeatures();

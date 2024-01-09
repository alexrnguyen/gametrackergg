import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../../config.js";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(config.atlasURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Gametrackergg").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const collections = await client.db("Gametrackergg").collections();
    collections.forEach((collection) =>
      console.log(collection.s.namespace.collection)
    );
  } catch (e) {
    console.error(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

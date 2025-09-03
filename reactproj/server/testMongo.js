const { MongoClient } = require("mongodb");

const uri =
  "mongodb://Admin:RZHjOekUFLIU0AqU@cluster0-shard-00-00.2iccwkj.mongodb.net:27017,cluster0-shard-00-01.2iccwkj.mongodb.net:27017,cluster0-shard-00-02.2iccwkj.mongodb.net:27017/admin?ssl=true&replicaSet=atlas-abcdef-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "✅ Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("❌ Connection error:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

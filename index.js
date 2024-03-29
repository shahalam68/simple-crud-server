const express = require('express');
const cors = require('cors');
const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// akmshahalam68
// beKxEaCaKddq1imA





const uri = "mongodb+srv://akmshahalam68:beKxEaCaKddq1imA@cluster0.zw4q92x.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDB");
    const usersCollections = database.collection("users");

    app.get('/users',async(req,res) =>{
      const cursor = usersCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/users/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)} 
      const user = await usersCollections.findOne(query);
      res.send(user);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log('new user', user);
      const result = await usersCollections.insertOne(user);
      res.send(result)
    });

    app.put('/users/:id' , async(req,res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id,user);
      const filter = {_id: new ObjectId(id)}
      const opttions = {upsert: true}
      const updatedUser = {
        $set:{
          name: user.name,
          email: user.email
        }
      }
      const result = await usersCollections.updateOne(filter, updatedUser, opttions);
      res.send(result)
    })

    app.delete('/users/:id',async(req, res) =>{
      const id = req.params.id;
      console.log('pls dlt form db' ,id);
      const query = {_id: new ObjectId(id)}
      const result = await usersCollections.deleteOne(query);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({
      ping: 1
    });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Simple Card running')
})
app.listen(port, () => {
  console.log(`Simple curd on port: ${port}`)
})
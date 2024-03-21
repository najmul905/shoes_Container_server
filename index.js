const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())

const categories = require('./Data/Categories.json')
const discount = require('./Data/Discount.json')
const for_you = require('./Data/forYou.json')
const banner_Categories = require('./Data/BannerCategories.json')
// const all_products=require('./Data/All_Products.json')

// mongoBD connection



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.yq5wikg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const ProductCollection = client.db("Shoes_containerDB").collection("All_Products_Data")

        // Read data from mongoDB

        app.get("/all_products", async (req, res) => {
            const result = await ProductCollection.find().toArray()
            res.send(result)
        })

      
        app.get("/all_products/:category", async (req, res) => {
            
                const category=req.params.category
                const query={Category:category}
                const result= await ProductCollection.find(query).toArray()
                res.send(result)     
        })
        app.get("/all_products/category/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result=await ProductCollection.findOne(query)
            res.send(result)
        })




        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Container Shoes')
})

// app.get('/categories',(req,res)=>{
// res.send(categories)
// })
// app.get('/discount',(req,res)=>{
//     res.send(discount)
// })
// app.get('/banner_Categories',(req,res)=>{
//     res.send(banner_Categories)
// })
// app.get('/for_you',(req,res)=>{
//     res.send(for_you)
// })
// app.get('/all_products',(req,res)=>{
//     res.send(all_products)
// })
// Get One products by Id
// app.get('/all_products/:id',(req,res)=>{
//     const id=req.params.id
//     console.log(id)
//     const selectedProducts=all_products.find(n=>n._Id===id)
//     res.send(selectedProducts)
// })


app.listen(port, () => {
    console.log(`Container shoes is running on ${port}`)
})
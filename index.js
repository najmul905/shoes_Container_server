const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



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

        const Shoes_ContainerDB= client.db("Shoes_containerDB")
        const ProductCollection=Shoes_ContainerDB.collection("All_Products_Data")
        const BannerCategoryCollection=Shoes_ContainerDB.collection("Banner_Category")
        const JustForCustomerCollection=Shoes_ContainerDB.collection("Just_For_Customer")
        const OfferCollection=Shoes_ContainerDB.collection("Offer")
        const userDataCollection=Shoes_ContainerDB.collection("UserData")

        // Read data from mongoDB(Get)
        app.get("/all_products", async (req, res) => {
            const result = await ProductCollection.find().toArray()
            res.send(result)
        })
       
        app.get("/banner_category", async (req, res) => {
            const result = await BannerCategoryCollection.find().toArray()
            res.send(result)
        })
        app.get("/just_for_customer", async (req, res) => {
            const result = await JustForCustomerCollection.find().toArray()
            res.send(result)
        })
        app.get("/just_for_customer/:id", async(req,res)=>{
            const id=req.params.id
            const query={_id:new ObjectId(id)}
            const result= await JustForCustomerCollection.findOne(query)
            res.send(result)

        })
        app.put('/just_for_customer/:id',async(req,res)=>{
            const id=req.params.id
            const filter={_id: new ObjectId(id)}
            const products=req.body
            const options={upsert:true}
            const editProducts={
                $set:{
                    Name:products.Name,
                    Price:products.Price,
                    Description:products.Description,
                    Image:products.Image
                }
            }
            console.log(editProducts,products)
            const result=await JustForCustomerCollection.updateOne(filter,editProducts)
            res.send(result)
        })
        app.get("/offer", async (req, res) => {
            const result = await OfferCollection.find().toArray()
            res.send(result)
        })
      app.get("/offer/:id",async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result= await OfferCollection.findOne(query)
        res.send(result)
      })
      app.put('/offer/:id', async(req,res)=>{
        const id=req.params.id
        const data=req.body
        const filter={_id: new ObjectId(id)}
        const options={upsert:false}
        const update={
            $set:{
                Name:data.Name,
                Price:data.Price,
                Description:data.Description,
                DiscountPercentage:data.DiscountPercentage,
                Image:data.Image
            }
        }
        console.log(update)
        const UpdateData=await OfferCollection.updateOne(filter,update,options)
        res.send(UpdateData)

      })
        app.get("/all_products/:category", async (req, res) => {
            const category=req.params.category
            const query={Category:category}
            const result= await ProductCollection.find(query).toArray()
            if(category=="All Category"){
                const result = await ProductCollection.find().toArray()
                return res.send(result)
            }
            res.send(result)     
        })
        app.get("/all_products/data/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result=await ProductCollection.findOne(query)
            res.send(result)
        })
        app.put("/all_products/data/:id",async(req,res)=>{
            const id=req.params.id 
            const data=req.body 
            const filter={_id: new ObjectId(id)}
            const options={upsert:true}
            const update={
                $set:{
                    Name:data.Name, 
                    Price:data.Price,
                    Details:data.Details,
                    Image:data.Image,
                    Category:data.Category
                }
            }
            console.log(update)
            const result=await ProductCollection.updateOne(filter,update,options)
            res.send(result)
        })
        app.get('/user',async(req,res)=>{
            const result=await userDataCollection.find().toArray()
            res.send(result)
        })
        // Create data
        app.post("/user", async (req, res) => {
           const userData=req.body
           const email=userData.email
           const query={email:email}
           const existingEmail= await userDataCollection.findOne(query)
           if(existingEmail){
           return res.send({message: 'You already existing'})
           }
           else{
            const addUser=await userDataCollection.insertOne(userData)
            res.send(addUser)
           }
           console.log(userData)
        });
        
        app.post('/all_products',async(req,res)=>{
           const item=req.body
           console.log(item)
          const result=await ProductCollection.insertOne(item)
          res.send(result)
           
        })
        app.get("/category",(req,res)=>{

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

app.listen(port, () => {
    console.log(`Container shoes is running on ${port}`)
})
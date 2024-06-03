const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const stripe=require('stripe')(process.env.payment_secret_key)
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
        const CardCollection=Shoes_ContainerDB.collection("CardData")
        const PaymentCollection=Shoes_ContainerDB.collection("payment")

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
        app.delete('/just_for_customer/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result=await JustForCustomerCollection.deleteOne(query)
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
      app.delete('/offer/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await OfferCollection.deleteOne(query)
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
        // get all Products data Id
        app.get("/all_products/data/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result=await ProductCollection.findOne(query)
            res.send(result)
        })
        // Create all Products
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
        // Delete One item from all Products
        app.delete('/all_products/data/:id',async(req,res)=>{
            const id=req.params.id 
            const query={_id: new ObjectId(id)}
            const result=await ProductCollection.deleteOne(query)
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
        app.get("/user/:id",async(req,res)=>{
            const id=req.params.id 
            const query={_id: new ObjectId(id)}
            const result=await userDataCollection.findOne(query)
            res.send(result)
        })
        app.delete('/user/:id',async(req,res)=>{
            const id=req.params.id 
            const query={_id:new ObjectId(id)}
            const result=await userDataCollection.deleteOne(query) 
            res.send(result)
        })
        app.patch("/user/:id",async(req,res)=>{
            const id=req.params.id 
            const data=req.body 
            const filter={_id: new ObjectId(id)}
            const update={
                $set:{
                    status:data.status
                }
            }
            const result=await userDataCollection.updateOne(filter,update)
            res.send(result)
        })
        app.post('/all_products',async(req,res)=>{
           const item=req.body
           console.log(item)
          const result=await ProductCollection.insertOne(item)
          res.send(result)
           
        })
       app.post('/card',async(req,res)=>{
        const cardData=req.body
        console.log(cardData)
        const result=await CardCollection.insertOne(cardData)
        res.send(result)
       })
       app.get("/card",async(req,res)=>{
        const result=await CardCollection.find().toArray()
        res.send(result)
       })
    //    app.get("/card/:id",async(req,res)=>{
    //     const id=req.params.id 
    //     const query={_id: new ObjectId(id)}
    //     const result=await CardCollection.findOne(query)
    //     res.send(result)
    //    })
       app.get("/card/:email",async(req,res)=>{
        const email=req.params.email
        const query={Email:email}
        const result=await CardCollection.find(query).toArray()
        res.send(result)
       })
       app.get('/card/data/:id',async(req,res)=>{
        const id=req.params.id 
        const query={_id:new ObjectId(id)}
        const result=await CardCollection.findOne(query)
        res.send(result)
       })
       app.delete('/card/data/:id',async(req,res)=>{
        const id=req.params.id 
        const query={_id:new ObjectId(id)}
        const result=await CardCollection.deleteOne(query)
        res.send(result)
       })
       app.post("/payment",async(req,res)=>{
        const payment=req.body 
        const query={_id:{$in: payment.cardId.map(id=> new ObjectId(id))}}
        const InsertResult=await PaymentCollection.insertOne(payment)
        const DeleteResult=await CardCollection.deleteMany(query)
        res.send({InsertResult,DeleteResult})
       })

       app.post("/create_payment_intent", async (req, res) => { // Fix the endpoint name
        try {
          const { price } = req.body; // Make sure to use the correct key 'price'
          if (!price) {
            return res.status(400).send({ error: "Price is required" });
          }
      
          const amount = price * 100; // Convert price to cents
          const paymentIntent = await stripe.paymentIntents.create({ // Fix the method name
            amount: amount,
            currency: 'usd',
            payment_method_types: ["card"]
          });
      
          res.send({
            clientSecret: paymentIntent.client_secret,
          });
        } catch (error) {
          console.error('Error creating payment intent:', error);
          res.status(500).send({ error: 'Internal Server Error' });
        }
      });
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
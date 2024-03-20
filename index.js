const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors')

app.use(cors())
const categories=require('./Data/Categories.json')
const discount=require('./Data/Discount.json')
const for_you=require('./Data/forYou.json')
const banner_Categories=require('./Data/BannerCategories.json')
const all_products=require('./Data/All_Products.json')

app.get('/',(req,res)=>{
res.send('Hello Container Shoes')
})

app.get('/categories',(req,res)=>{
res.send(categories)
})
app.get('/discount',(req,res)=>{
    res.send(discount)
})
app.get('/banner_Categories',(req,res)=>{
    res.send(banner_Categories)
})
app.get('/for_you',(req,res)=>{
    res.send(for_you)
})
app.get('/all_products',(req,res)=>{
    res.send(all_products)
})
// Get One products by Id
app.get('/all_products/:id',(req,res)=>{
    const id=req.params.id
    console.log(id)
    const selectedProducts=all_products.find(n=>n._Id===id)
    res.send(selectedProducts)
})
// get Products by Category
// app.get('/all_products/:category',async(req,res)=>{
//     const category=req.params.category
//        const query={Category:category}
//        console.log(query)
//        const result=await all_products.filter(query)
//        res.send(result)
    
// })
app.get('all_products/:category',(req,res)=>{
    const category=req.params.category
    const query={Category:category}
    const result=all_products.filter(query)
    res.send(result)
})

app.listen(port,()=>{
    console.log(`Container shoes is running on ${port}`)
})
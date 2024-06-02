const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");


app.use(express.json());
app.use(cors());

// MongoDB ile veritabani baglantisi
const mongoURI = "mongodb+srv://barisozkan:dq2uxb5ZZuKE6qFb@cluster0.p44mla5.mongodb.net/better-buy"
mongoose.connect(mongoURI)

// API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Goruntu Depolama

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})



const upload = multer({storage:storage})


// Resim yukleme endpointi

app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{//const baseurl ile url dinamik olarak uygulamanın çalıştığı domanini kullanacak
    const baseUrl = req.protocol + '://' + req.get('host');
    res.json({
        success:1,
        image_url: `${baseUrl}/images/${req.file.filename}`
    })
})

// Ürün oluşturma şeması 
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        dafault:true,
    },
    
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id ;
    if(products.length>0)
        {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id= last_product.id+1;
        }else{
            id=1;
        }//id numarasını her yeni ürün eklendiğinde 1 artırmak için eğer eklenen ilk ürünse id 1 oluyor
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//API ürün silme
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("remove");
    res.json({
        success:true,
        name:req.body.name
    })
})

// Tum urunleri listelemek icin API

app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All products Fetched");
    res.send(products);
})

// Kullanici modeli icin sema olusturma

const Users = mongoose.model("Users", {
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Kullanici kayit olma semasi

app.post('/signup',async (req,res)=>{
    
    let check = await Users.findOne({email:req.body.email});  //veritabaninda e-posta adresi ile bir kullanici olup olmadıgini kontrol eder
    if(check) {
        return res.status(400).json({success:false,errors:"existing user found with same email address"})  // var ise boyle bir email var hatasi dondurur
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {  //sepet icin baslangicta 300 urunluk bos bir obje olusturur
        cart[i]= 0;
        
    }

    const user = new Users({  // yeni bir kullanici nesnesi
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();  //kullaniciyi kayit eder

    const data = {  //JWT oluşturmak için gerekli kullanıcı verilerini hazırlar
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');  // Kullanıcıya bir JWT (JSON Web Token) oluşturur ve 'secret_ecom' anahtarı ile imzalar
    res.json({success:true,token})  //kullanici kaydi basariyla tamamlandiini ve tokeni dondurur.

})
// kullanıcı giriş için endpoint
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;//şifre karşılaştırması
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});// eğer şifre doğruysa
        }
        else{
            res.json({success:false,errors:"Wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong email id"});
    }
})


//NewCollections olusturma endopint

app.get('/newcollections', async (req, res) => {
	let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collections Fetched");
    res.send(newcollection);
})

//Popular in Women bolumunu olusturma endpointi

app.get('/popularinwomen', async (req, res) => {
	let products = await Product.find({category: "women"});
    let popular_in_women = products.splice(0,  4);
    console.log("Popular In Women Fetched");
    res.send(popular_in_women);
});

// Admin kullanici siparis goruntulume endpoint

    const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).send({errors:"lütfen geçerli token kullanarak kimlik doğrulaması yapın "})
            
        }
        else{
            try {
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            } catch (error) {
                res.status(401).send({errors:"Lutfen token ile dogrulama yapin"})
            }
        }
    }

// sepete urun ekleme endpoint

app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    //console.log(req.body,req.user);

    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    // Kullanici siparsini artirma ve veritabaninda gosterme
    res.send("Added")

})

//Sepetten urun silme endpoint

app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    // Kullanici siparsini azaltma ve veritabaninda gosterme
    res.send("Removed")

})

//Sepet bilgisi getirme endpoint

app.post('/getcart', fetchUser, async (req, res) => {
    console.log("Get Cart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
  
})




app.listen(port,(error)=>{
    if (!error){
        console.log("Server Running on Port "+port)
        
    }
    else{
        console.log("Error : +error")
    }
});

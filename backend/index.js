require('dotenv').config(); // .env dosyasını okumak için
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// MongoDB ile veritabani baglantisi

mongoose.connect("mongodb+srv://barisozkan:dq2uxb5ZZuKE6qFb@cluster0.p44mla5.mongodb.net/better-buy")

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

// Ürün modeli
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Ürün ekleme rotası
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product = products[products.length - 1];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    await product.save();
    res.json({
        success: true,
        name: req.body.name,
    });
});

// Ürün silme rotası
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({
        success: true,
        name: req.body.name
    });
});

// Tüm ürünleri listeleme rotası
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    res.send(products);
});

// Kullanıcı modeli
const User = mongoose.model("User", {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Kullanıcı kayıt rotası
app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});

// Kullanıcı giriş rotası
app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            };
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong email id" });
    }
});

// Yeni koleksiyonlar rotası
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    res.send(newcollection);
});

// Popüler kadın ürünleri rotası
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.splice(0, 4);
    res.send(popular_in_women);
});

// Token doğrulama
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Lütfen geçerli token kullanarak kimlik doğrulaması yapın" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Lütfen token ile doğrulama yapın" });
        }
    }
};

// Sepete ürün ekleme rotası
app.post('/addtocart', fetchUser, async (req, res) => {
    let userData = await User.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});

// Sepetten ürün çıkarma rotası
app.post('/removefromcart', fetchUser, async (req, res) => {
    let userData = await User.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0)
        userData.cartData[req.body.itemId] -= 1;
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed");
});

// Sepet bilgisi getirme rotası
app.post('/getcart', fetchUser, async (req, res) => {
    let userData = await User.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

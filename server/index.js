import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Bids, Category, Product, Transaction, User } from './Schema.js'

const app = express();
app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = 6001;
mongoose.connect('mongodb://localhost:27017/Auctions',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{



    app.post('/register', async (req, res) => {
        const { username, email, usertype, password } = req.body;
        try {
          
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username, email, usertype, password: hashedPassword
            });

            const cat = await Category.findOne();
            console.log(cat);
            if(cat){
                console.log(cat);
            }else{
                const newCat = new Category({categories: []});
                await newCat.save(); 
            }
            

            const userCreated = await newUser.save();
            return res.status(201).json(userCreated);

        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });



    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            } else{
                return res.json(user);
            }
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });


    // fetch individual user

    app.get('/fetch-user/:id', async(req, res)=>{
        try{
            const user = await User.findById(req.params.id);
            res.json(user);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })


    // fetch users

    app.get('/fetch-users', async(req, res)=>{
        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })

    // deposit funds

    app.post('/deposit', async(req, res)=>{
        const {userId, depositAmount, depositMode} = req.body;
       
        try{
            const user = await User.findById(userId);

            const transaction = new Transaction({ userId,
                userName: user.username,
                transactionType: "deposit",
                paymentMethod: depositMode,
                amount: depositAmount,
                time: new Date()
            });

            user.funds = parseInt(user.funds) + parseInt(depositAmount);

            await user.save();
            
            await transaction.save();
            res.status(200).json({ message: 'deposit successful' });

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })

    // withdraw funds

    app.post('/user-withdraw', async(req, res)=>{
        const {userId, withdrawAmount, withdrawMode} = req.body;
       
        try{
            const user = await User.findById(userId);

            const transaction = new Transaction({ userId,
                userName: user.username,
                transactionType: "withdraw",
                paymentMethod: withdrawMode,
                amount: withdrawAmount,
                time: new Date()
            });

            user.funds = parseInt(user.funds) - parseInt(withdrawAmount);

            await user.save();
            
            await transaction.save();
            res.status(200).json({ message: 'withdrawal successful' });

        }catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error occured' });
        }
    })

    // fetch transactions

    app.get('/fetch-transactions', async(req, res)=>{
        try{
            const transactions = await Transaction.find();
            res.json(transactions);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })

      // approve seller

      app.post('/approve-seller', async(req, res)=>{
        const {id} = req.body;
        try{
            const user = await User.findById(id);
            user.approval = "Accepted";
            const userUpdated = await user.save();
            res.json(userUpdated);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })


     // reject seller

     app.post('/reject-seller', async(req, res)=>{
        const {id} = req.body;
        try{
            const user = await User.findById(id);
            user.approval = "Rejected";
            const userUpdated = await user.save();
            res.json(userUpdated);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })


    // withdeaw seller funds

    app.get('/seller-fund-withdraw/:id', async(req, res)=>{
        try{
            const user = await User.findById(req.params.id);
            user.funds = 0;
            await user.save();
            res.json(user);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })


     // Fetch individual product
     app.get('/fetch-product-details/:id', async(req, res)=>{
        const id = req.params.id;
        try{
            const product = await Product.findById(id);
            res.json(product);
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    // fetch products

    app.get('/fetch-products', async(req, res)=>{
        try{
            const products = await Product.find();
            res.json(products);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })

     // fetch bids

     app.get('/fetch-bids', async(req, res)=>{
        try{
            const bids = await Bids.find();
            res.json(bids);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })


    // Fetch categories

    app.get('/fetch-categories', async(req, res)=>{
        try{
            const data = await Category.find();
            if(data.length===0){
                const newData = new Category({categories: []})
                await newData.save();
                return res.json(newData[0].categories);
            }else{
                return res.json(data[0].categories);
            }
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


    // Add new product

    app.post('/add-new-product', async(req, res)=>{
        const {sellerId, sellerName, sellerEmail, productName, productDescription, productMainImg, productCarousel, 
            productCategory, productNewCategory, auctionCloseTime, productStartPrice} = req.body;
        try{
            if(productCategory === 'new category'){
                const categorySchema = await Category.findOne();
                categorySchema.categories.push(productNewCategory);
                await categorySchema.save();

                const newProduct = new Product({sellerId, sellerName, sellerEmail, title: productName, description: productDescription,
                         mainImg: productMainImg, carousel: productCarousel, category: productNewCategory,
                         auctionCloseTime, startPrice: productStartPrice});
                await newProduct.save();
            } else{
                const newProduct = new Product({sellerId, sellerName, sellerEmail, title: productName, description: productDescription,
                    mainImg: productMainImg, carousel: productCarousel, category: productCategory,
                    auctionCloseTime, startPrice: productStartPrice});
                await newProduct.save();
            }
            res.json({message: "product added!!"});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    // update product

    app.put('/update-product/:id', async(req, res)=>{
        const {productName, productDescription, productMainImg, productCarousel, 
            productCategory, productNewCategory, auctionCloseTime, productStartPrice} = req.body;
        try{
            if(productCategory === 'new category'){
                const admin = await Admin.findOne();
                admin.categories.push(productNewCategory);
                await admin.save();

                const product = await Product.findById(req.params.id);

                product.title = productName;
                product.description = productDescription;
                product.mainImg = productMainImg;
                product.carousel = productCarousel;
                product.category = productNewCategory;
                product.auctionCloseTime = auctionCloseTime;
                product.startPrice = productStartPrice;

                await product.save();
               
            } else{
                const product = await Product.findById(req.params.id);

                product.title = productName;
                product.description = productDescription;
                product.mainImg = productMainImg;
                product.carousel = productCarousel;
                product.category = productCategory;
                product.auctionCloseTime = auctionCloseTime;
                product.startPrice = productStartPrice;

                await product.save();
            }
            res.json({message: "product updated!!"});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })




    // make bid

    app.post('/make-bidding', async(req, res)=>{
        const {productId, title, description, mainImg, bidderId, bidderName, bidderEmail, bidAmount, bidTime} = req.body;
        try{
            const product = await Product.findById(productId);

            const newBid = new Bids({productId, sellerId: product.sellerId, title, description, mainImg, bidderId, bidderName, bidderEmail, bidAmount, bidTime});

            console.log(product.topBid.amount);
            if (parseInt(product.topBid.amount) < parseInt(bidAmount)){
                console.log("hollaa");
                product.topBid.bidderId = bidderId;
                product.topBid.bidderName = bidderName;
                product.topBid.bidderEmail = bidderEmail;
                product.topBid.amount = parseInt(bidAmount);

                const newPro = await product.save();

                console.log(newPro);
            }
            await newBid.save();
            res.json({message: 'Bid placed'});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


   
     // close bidding

     app.get('/close-bidding/:id', async(req, res)=>{
        try{
            const product = await Product.findById(req.params.id);
            
            if(product.topBid.bidderId === ""){
                product.status = "Unsold";
            }else{
                product.status = "sold";

                const user = await User.findById(product.topBid.bidderId);
                const seller = await User.findById(product.sellerId);

                user.funds = parseInt(user.funds) - parseInt(product.topBid.amount);
                seller.funds = parseInt(seller.funds) + parseInt(product.topBid.amount);

                await user.save();
                await seller.save();


                const transaction = new Transaction({ 
                    userId: user._id,
                    userName: user.username,
                    transactionType: "Auction",
                    paymentMethod: "Auction payment",
                    amount: product.topBid.amount,
                    time: new Date()
                });
                
                await transaction.save();
            }

            await product.save();

        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })
    

   



    app.listen(PORT, ()=>{
        console.log('running @ 6001');
    })
}).catch((e)=> console.log(`Error in db connection ${e}`));
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    usertype: {type: String},
    funds: {
        type: Number,
        default: 0
    },
    approval: {
        type: String,
        default: "Pending"
    }
});

const generalSchema = new mongoose.Schema({
    categories: {type: Array, default: []}
});

const productSchema = new mongoose.Schema({
    sellerId: String,
    sellerName: String,
    sellerEmail: String,
    title: {type: String},
    description: {type: String},
    mainImg: {type: String},
    carousel: {type: Array},
    category: {type: String},
    auctionCloseTime: {type: String},
    startPrice: {type: Number},
    topBid: {
        bidderId: {
            type: String,
            default: ''
        },
        bidderName: {
            type: String,
            default: ''
        },
        bidderEmail: {
            type: String,
            default: ''
        },
        amount: {
            type: Number,
            default: 0
        },
    },
    status: {
        type: String,
        default: "Available"
    }
})

const bidsSchema = new mongoose.Schema({
    productId: {type: String},
    sellerId: {type: String},
    title: {type: String},
    description: {type: String},
    mainImg: {type: String},
    bidderId: {type: String},
    bidderName: {type: String},
    bidderEmail: {type: String},
    bidAmount: {type: Number},
    bidTime: {type: String}
})

const transactionSchema = new mongoose.Schema({
    userId: {type: String},
    userName: {type: String},
    transactionType: {type: String},
    paymentMethod: {type: String},
    amount: {type: String},
    time: {type: String}
})


export const User = mongoose.model('users', userSchema);
export const Category = mongoose.model('general', generalSchema);
export const Product = mongoose.model('products', productSchema);
export const Bids = mongoose.model('bids', bidsSchema);
export const Transaction = mongoose.model('transactions', transactionSchema);

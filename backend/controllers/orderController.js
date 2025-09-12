// import { currency } from "../../admin/src/App.jsx";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
import { response } from "express";


//global variables
const currency = 'usd'
const deliveryCharge = 10


//gateway intialize 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new  razorpay({
key_id : process.env.RAZORPAY_KEY_ID,
key_secret : process.env.RAZORPAY_KEY_SECRET,

})


//placing orders using cod
const placeOrder = async (req,res) =>{

try {
    // Destructure what comes from frontend
    const { userId, items, amount, address, paymentMethod } = req.body;

    // Prepare order data using only frontend-sent values
    let orderData = {
      userId,
      items,             // array of items from frontend
      amount,            // total amount sent from frontend
      address,           // object with firstName, lastName, street etc.
      paymentMethod,
      payment: paymentMethod === 'cod' ? false : true, // mark false for COD
      date: Date.now()
    };

    const newOrder = new orderModel(orderData)
    await newOrder.save();

    // Clear user's cart after order
    await userModel.findByIdAndUpdate(userId,{cartData:{}})

    res.json({success:true,message:"Order Placed"})

} catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
    
}

}

//verify stripe
const verifyStripe = async (req,res) =>{
    const {orderId,success,userId} = req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            await userModel.findByIdAndUpdate(userId ,{cartData: {}})
            res.json({success:true});
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
            console.log(error);
    res.json({success:false,message:error.message})
    }
}


//placing orders using stripe method
const placeOrderStripe = async (req,res) =>{
try {
    
 const { userId, items, amount, address, paymentMethod } = req.body;
 const { origin }=req.headers;

     const orderData = {
      userId,
      items,             // array of items from frontend
      amount,            // total amount sent from frontend
      address,           // object with firstName, lastName, street etc.
      paymentMethod:"Stripe",
      payment:false, // mark false for COD
      date: Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save();


    // const line_items= items.map(()=>({
    //     price_data:{
    //         currency:currency,
    //         product_data:{
    //             name:item.name
    //         },
    //         unit_amount:item.price *100
    //     },
    //     quantity:item.quantity
    // }))



    // line_items.push({
    //             price_data:{
    //         currency:currency,
    //         product_data:{
    //             name:'Delivery fee'
    //         },
    //         unit_amount:deliveryCharge *100
    //     },
    //     quantity:item.quantity
    // })


    // map items properly
const line_items = items.map((item) => ({
    price_data: {
        currency: currency,
        product_data: {
            name: item.name
        },
        unit_amount: item.price * 100
    },
    quantity: item.quantity
}));

// add delivery fee
line_items.push({
    price_data: {
        currency: currency,
        product_data: {
            name: 'Delivery fee'
        },
        unit_amount: deliveryCharge * 100
    },
    quantity: 1   // ✅ Use a number, not item.quantity
});

const session = await stripe.checkout.sessions.create({
    success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
    line_items,
    mode: 'payment',
})

res.json({success:true,session_url:session.url});

} catch (error) {
        console.log(error);
    res.json({success:false,message:error.message})
}
}


//placing orders using Razorpay  method
const placeOrderRazorpay = async (req,res) =>{
try {
     const { userId, items, amount, address, paymentMethod } = req.body;


     const orderData = {
      userId,
      items,             // array of items from frontend
      amount,            // total amount sent from frontend
      address,           // object with firstName, lastName, street etc.
      paymentMethod:"Razorpay",
      payment:false, // mark false for COD
      date: Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save();


    const options = {
        amount: amount *100,
        currency: currency.toUpperCase(),
        receipt: newOrder._id.toString()
    }
await razorpayInstance.orders.create(options,(error,order)=>{
    if (error) {
        console.log(error);
        return res.json ({success:false,message:error})
        
    }
    res.json({success:true,order})
})
} catch (error) {
            console.log(error);
    res.json({success:false,message:error.message})
}
}


//

const verifyRazorpay = async (req,res)=>{
    try {
        const{userId,razorpay_order_id} =req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    // console.log(orderInfo);
    if (orderInfo.status === 'paid') {
        await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.json({success:true,message:"payment successful"})
        
    }else{
        res.json({success:false,message:"payment failed"})
    }
    
    } catch (error) {
                    console.log(error);
    res.json({success:false,message:error.message})

    }
}

//All Orders data from admin panel
const allOrders = async (req,res) =>{

try {
    
    const orders = await orderModel.find({})
    res.json ({success:true,orders})

} catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})    
}

}

//User Order for Frontend
const userOrders = async (req,res) =>{
try {
    
    const {userId} =req.body

    const orders = await orderModel.find({userId})
    res.json ({success:true,orders})

} catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
}
}

//update orders status from Admin Panle
const updateStatus = async (req,res) =>{
try {
    
const {orderId , status} = req.body
await orderModel.findByIdAndUpdate(orderId,{status} )
res.json({success:true,message:'Status Updated'})

} catch (error) {
     console.log(error);
    res.json({success:false,message:error.message})   
}


}

export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus,verifyStripe,verifyRazorpay}



























// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// // import orderModel from '../models/orderModel.js';

// //placing orders using cod
// const placeOrder = async (req,res) =>{

// try {
    

// const {userId, items,amount, address} =req.body;
// // const orderData = {
// //    userId: String(userId),  
// //     items,
// //     amount,
// //     address,
// //     paymentMethod:"COD",
// //     payment:false,
// //     date:Date.now()
// // }
// let orderData = {
//   userId,
//   address: {
//     firstName: formData.firstName,
//     lastName: formData.lastName,
//     street: formData.street,
//     city: formData.city,
//     state: formData.state,
//     country: formData.country,
//     zipcode: formData.zipcode,
//     phone: formData.phone
//   },
//   items: orderItems,
//   amount: getCartAmount() + delivery_fee,
//   paymentMethod: method
// };
// const newOrder = new orderModel(orderData)
// await newOrder.save();

// await userModel.findByIdAndUpdate(userId,{cartData:{}})



// res.json({success:true,message:"Order Placed"})

// } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message})
    
// }

// }

// //placing orders using stripe method
// const placeOrderStripe = async (req,res) =>{

// }


// //placing orders using Razorpay  method
// const placeOrderRazorpay = async (req,res) =>{

// }

// //All Orders data from admin panel
// const allOrders = async (req,res) =>{

// try {
    
//     const orders = await orderModel.find({})
//     res.json ({success:true,orders})

// } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message})    
// }

// }

// //User Order for Frontend
// const userOrders = async (req,res) =>{
// try {
    
//     const {userId} =req.body

//     const orders = await orderModel.find({userId})
//     res.json ({success:true,orders})

// } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message})
// }
// }

// //update orders status from Admin Panle
// const updateStatus = async (req,res) =>{



// }

// export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus}
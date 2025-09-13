import userModel from "../models/userModel.js";

// ✅ Add to Cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    // Ensure cartData is an object
    if (typeof cartData !== 'object' || cartData === null) {
      cartData = {};
    }

    // Ensure cartData[itemId] is an object
    if (typeof cartData[itemId] !== 'object' || cartData[itemId] === null) {
      cartData[itemId] = {};
    }

    // Update quantity
    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (typeof cartData !== 'object' || cartData === null) {
      cartData = {};
    }

    if (typeof cartData[itemId] !== 'object' || cartData[itemId] === null) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = quantity;

    // Optional cleanup: remove item if quantity is 0
    if (quantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };







// // add products to user cart

// import userModel from "../models/userModel.js";

// const addToCart = async (req,res)=>{
// try {
    
//     const {userId, itemId, size } = req.body
//     const userData = await userModel.findById(userId)
//      let cartData = await userData.cartData;

//      if (cartData[itemId]) {
//         if (cartData[itemId][size]) {
//             cartData[itemId][size] += 1
//         }
//         else{
//             cartData[itemId][size] = 1
//         }
//      }else{
//         cartData[itemId]={}
//         cartData[itemId][size]= 1
//      }

//    await userModel.findByIdAndUpdate(userId , {cartData})
//    res.json ({success:true , message: "Added To Cart"})

// } catch (error) {
//     console.log(error)
//     res.json({success:false , message: error.message})
// }

// }


// // update user cart
// const updateCart = async (req,res)=>{
// try {
   
//     const {userId, itemId, size, quantity } = req.body
//     const userData = await userModel.findById(userId)
//      let cartData = await userData.cartData;

//      cartData=[itemId][size]=quantity

// await userModel.findByIdAndUpdate(userId , {cartData})
//    res.json ({success:true , message: "Cart Updated"})


// } catch (error) {
//     console.log(error)
//     res.json({success:false , message: error.message})    
// }
    
// }


// // get user cart data
// const getUserCart = async (req,res)=>{

//     try {
//         const {userId } = req.body
           
//     const userData = await userModel.findById(userId)
//   let cartData = await userData.cartData;
// res.json ({success:true , cartData})

//     } catch (error) {
//            console.log(error)
//     res.json({success:false , message: error.message})  
//     }
// }


// export {addToCart,updateCart,getUserCart}



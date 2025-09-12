import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// import { placeOrder } from "../../../backend/controllers/orderController";


  export const ShopContext = createContext();             
//   created context variable export to use it anywhere

const ShopContextProvider = (props)=> {
    const currency = '₹';
    const delivery_fee =100;
    const backendUrl =import.meta.env.VITE_BACKEND_URL
    const [search,setSearch]= useState('');
    const [showSearch,setShowSearch]=useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products,setProducts]= useState([]);
    const [token,setToken] =useState('');
    const [userId, setUserId] = useState('');

    const navigate = useNavigate ();

    const addToCart = async (itemId,size) => {
        if (!size){
            toast.error('Select Product Size');
            return;
        }
        let cartData = structuredClone(cartItems);      //makes copy of cart items & can access by cartdata

        if(cartData[itemId]) {
            if(cartData[itemId][size]) {
               cartData[itemId][size] += 1;
            }
                   else {
            cartData[itemId][size]= 1;
             }
         }
             else {
        cartData[itemId]={};
        cartData[itemId][size] = 1;
    }
 
    setCartItems(cartData);

    if (token) {
        try {
            // await axios.post(backendUrl + '/api/cart/add', {itemId,size}, {headers:{token}})
     

        //    await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });

        //    await axios.post('/api/cart/add', {userId: localStorage.getItem('userId'), itemId,size}, {headers: { token }});

await axios.post('/api/cart/add', {userId: localStorage.getItem('userId'), itemId,size}, {headers: { token }});

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    }


const getCartCount = ()=>{
    let totalcount = 0;
    for(const items in cartItems){
        for (const item in cartItems[items]){
            try {
                if (cartItems[items][item]) {
                    totalcount += cartItems[items][item];
                    
                }
            } catch (error) {
                console.log(error);
            toast.error(error.message)
            }
        }
    }
    return totalcount;
}

//     useEffect(()=>
// {
// console.log(cartItems);
// },[cartItems])


const updateQuantity = async (itemId,size,quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;

setCartItems (cartData);

if (token) {
    try {
        await axios.post('/api/cart/update',{itemId,size,quantity},{headers:{token}})

    } catch (error) {
        console.log(error);
            toast.error(error.message)
    }
}
}

const getCartAmount = () => {
    let totalAmount =0;
    for (const items in cartItems){
        let itemInfo = products.find((product)=> product._id === items );
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }catch(error){

                }
            }
    }
    return totalAmount;
}


// const getProductsData =async ()=>{
//     try {
        
//         const response=await axios.get(backendUrl + '/api/product/list')
//         console.log("test11111",response.data);
//         if(response.data.success){
//             console.log("Setting products:", response.data.products);
//             setProducts(response.data.products)
//         }else{
//             toast.error(response.data.message)
//         }
//     } catch (error) {
//         console.log(error)
//         toast.error(error.message)
        
//     }
// }
const getProductsData = async () => {
  try {
    const response = await axios.get('/api/product/list');
    if (response.data.success && Array.isArray(response.data.products)) {
      setProducts(response.data.products);
      console.log("✅ Products loaded:", response.data.products);
    } else {
      toast.error("Failed to load products");
    }
  } catch (error) {
    toast.error(error.message);
  }
};

// const getProductsData = async () => {
//   try {
//     const response = await axios.get('/api/product/list'); // '/api' works in dev via proxy
//     const data = response.data;

//     console.log("test11111", data);

//     if (data && data.success) {
//       console.log("Setting products:", data.products);
//       setProducts(data.products); // Make sure setProducts is in scope
//     } else {
//       toast.error(data?.message || "Failed to fetch products");
//     }
//   } catch (error) {
//         console.log(error);
//             toast.error(error.message)
//   }
// };

const getUSerCart = async (token) =>{
    try {
        const response = await axios.post('/api/cart/get',{},{headers:{token}})
        if (response.data.success) {
            setCartItems(response.data.cartData)
        }
    } catch (error) {
         console.log(error);
            toast.error(error.message)
    }
}

useEffect(() => {
  console.log("Products updated:", products); // confirms state change
}, [products]);


// useEffect(() => {
//   const localToken = localStorage.getItem('token');
//   if (localToken) {
//     setToken(localToken);
//     getUSerCart(localToken); // ✅ pass the token correctly
//   }
// }, []);

useEffect(() => {
  const localToken = localStorage.getItem('token');
  const localUserId = localStorage.getItem('userId');
  if (localToken) {
    setToken(localToken);
    if (localUserId) setUserId(localUserId);
    getUSerCart(localToken);
  }
}, []);



useEffect(()=>{
    getProductsData()
},[])


useEffect(()=>{
    if(!token && localStorage.getItem('token')){
     setToken(localStorage.getItem('token'))
     getUSerCart()
    }
},[])




const value = {
products,
currency,
delivery_fee,
search,setSearch,showSearch,setShowSearch,
cartItems,addToCart,setCartItems,
getCartCount,updateQuantity,
getCartAmount, navigate, backendUrl,setToken,token,userId, setUserId
// , placeOrder
    }

    return(
        <ShopContext.Provider value={value}>
        {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
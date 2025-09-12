import React from 'react'

const NewsLetterBox = () => {
    const onSumitHandler=()=>{
event.preventDefault();
    }
  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe Now and Get 20% off</p>
      <p className='text-grasy-400 mt-3'>Stay updated with our latest deals, news, and exclusive offers!</p>

      <form onSubmit={onSumitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6border pl-3 '>
        <input className='border border-black w-full sm:flex-1' type="email" placeholder='Enter your email' required/>
<button className='  bg-black text-white text-xs px-10' type='submit' >SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsLetterBox

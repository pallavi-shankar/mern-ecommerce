import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
            <img src={assets.logo} className='mb-5 w-32' alt=""/>
            <p className='w-full md:w-2/3 text-gray-600'>
                Delivering quality, trust, and innovation every step of the way.
            </p>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>
COMPANY
            </p>
            <ul className='flex flex-col gap-1 text-gray-600'>
<li>Home</li>
<li>About Us</li>
<li>Delivery</li>
<li>Privacy and Policy</li>
            </ul>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>
                GET IN TOUCH
            </p>
            <ul  className='flex flex-col gap-1 text-gray-600'>
<li>+91 76X690X12X</li>
<li>paash@gmail.com </li>
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer

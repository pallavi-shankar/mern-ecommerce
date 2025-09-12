import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
        </div>

        <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img}/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Paash was born out of a passion for innovation and a desire to revolutionize the online shopping experience. From day one, we've worked tirelessly to curate a diverse selection of high-quality products that blend style, functionality, and affordability.</p>
        <p>Whether you're looking for the latest fashion trends, must-have gadgets, or everyday essentials, Paash is your one-stop destination. Our goal is to deliver not just products, but satisfaction — with fast shipping, secure payments, and responsive customer support. </p>
        <b>OUR MISSION</b>
        <p>At Paash, our mission is to empower customers by providing a seamless, reliable, and enjoyable online shopping experience. We strive to offer a thoughtfully curated range of high-quality products that combine style, affordability, and innovation</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px16 py-8 sm:py-20 flex flex-col gap-5 '>
          <b>Quality Assurance</b>
          <p className='text-gray-600'>At Paash, quality isn’t just a promise — it’s a commitment. Every product in our collection undergoes a thorough selection and inspection process to ensure it meets our high standards for durability, design, and customer satisfaction.  </p>
        </div>
                <div className='border px-10 md:px16 py-8 sm:py-20 flex flex-col gap-5 '>
          <b>Convenience</b>
          <p className='text-gray-600'>At Paash, we prioritize your convenience at every step. From intuitive browsing and seamless checkout to fast delivery and easy returns, our platform is designed to make shopping effortless. With 24/7 access, secure payment options, and mobile-friendly navigation, you can shop anytime, anywhere — with complete peace of mind. Your comfort is our commitment. </p>
        </div>
              <div className='border px-10 md:px16 py-8 sm:py-20 flex flex-col gap-5 '>
          <b>Exceptional Customer Service</b>
          <p className='text-gray-600'>At Paash, we believe that great products deserve even greater support. Our dedicated customer service team is here to ensure your shopping experience is smooth, hassle-free, and satisfying.  </p>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  )
}

export default About

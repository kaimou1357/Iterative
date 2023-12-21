import React from 'react'
import pc from "../../../public/pc.jpg"
import Image from 'next/image'
import Link from 'next/link'

export default function banner() {
  return (
    <div className='relative'>
       <div className='absolute inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center '>
       <h2 className="text-5xl font-bold text-white">Iterative</h2>
          <p className="h2 my-5 text-lg text-white">
            Build amazing applications without writing a single line of code.
          </p>
          <Link href="/auth" className="bg-blue-500 text-white p-2 rounded ">
            Get Started!
          </Link>
       </div>
       
          <Image
      src={pc}
      width={1920}
      height={1080}
      alt="Picture of the author"
    />
    </div>
  
  )
}

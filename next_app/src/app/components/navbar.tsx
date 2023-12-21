

import Link from 'next/link'


export default function Navbar() {


  return (
 
<div className='bg-black'>


        <div className=''>
          <nav >
            <ul className="bg-black flex justify-around py-2 font-medium ">
              <li>
                <Link
                  className="  text-white hover:text-blue-700 "
                  href="/"
                >
                  Iterative
                </Link>
               
              </li>
              <div className='flex flex-row gap-8'>
              <li>
                <Link
                  className="  text-white  hover:text-blue-700 "
                  href="/"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link className="  text-white hover:text-blue-700   " href="/">
                  Contact
                </Link>
              </li>
              </div>
            </ul>
          </nav >
       
        
        </div>
        </div>



      );
    };

  
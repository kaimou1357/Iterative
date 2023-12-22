'use client'

import React, { useEffect } from "react";
import pc from "../../../public/pc.jpg";
import Image from "next/image";
import Link from "next/link";
import test from "../../../public/TBD.png";
import Modal from "./modal";

export default function banner() {


  useEffect(() => {
    const intervalId = setInterval(() => {
      // Apply the animation classes here
    }, 5000); // Restart every 5 seconds
  
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className=" bg-black h-auto">
      <div className="">
        <div className=" inset-0 bg-zinc-950 h-auto  bg-opacity-80 flex flex-col items-center justify-center">
          <div className="flex flex-col  gap-10 py-10 sm:py-24 ">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white">Iterative</h2>
              <p className="   my-5 text-lg text-white">
                Build amazing applications without writing a single line of
                code.
              </p>

              <Link
                href="/auth"
                className="bg-blue-500 text-white p-2 rounded "
              >
                Get Started!
              </Link>
            </div>

            
            <div className="flex flex-col mt-5">
              <div className="bg-gray-900 h-96 w-auto flex rounded ">
                <div className=" flex flex-col  mx-10  justify-center items-center rounded overflow-hidden   animate-masking delay-[2000ms] ">
                  <Modal />
                </div>
              </div>
              <div className=" border border-white rounded-lg">
                <div className="w-44 "><p className="overflow-hidden whitespace-nowrap border-r-4 border-r-white animate-typing  my-3 ml-3 text-lg text-white ">
                  Make me a modal
                </p></div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Image src={pc} width={1920} height={1080} alt="Picture of the author" /> */}
    </div>
  );
}

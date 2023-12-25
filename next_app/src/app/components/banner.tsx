"use client";

import React, { useEffect } from "react";
import pc from "../../../public/pc.jpg";
import Image from "next/image";
import Link from "next/link";
import test from "../../../public/TBD.png";
import Modal from "./modal";

export default function banner() {
  return (
    <div className=" h-auto bg-black">
      <div className="">
        <div className=" inset-0 flex h-auto  flex-col items-center justify-center bg-zinc-950 bg-opacity-80">
          <div className="flex flex-col  gap-10 py-10 sm:py-24 ">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white">Iterative</h2>
              <p className="   my-5 text-lg text-white">
                Build amazing applications without writing a single line of
                code.
              </p>

              <Link
                href="/tool"
                className="rounded bg-blue-500 p-2 text-white "
              >
                Get Started!
              </Link>
            </div>

            <div className="mt-5 flex flex-col">
              <div className="flex h-96 w-auto rounded bg-gray-900 ">
                <div className=" mx-10 flex  animate-masking  flex-col items-center justify-center overflow-hidden   rounded delay-[2000ms] ">
                  <Modal />
                </div>
              </div>
              <div className=" rounded-lg border border-white">
                <div className="w-44 ">
                  <p className="my-3 ml-3 animate-typing overflow-hidden whitespace-nowrap  border-r-4 border-r-white text-lg text-white ">
                    Make me a modal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Image src={pc} width={1920} height={1080} alt="Picture of the author" /> */}
    </div>
  );
}

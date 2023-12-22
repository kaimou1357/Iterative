import React from "react";
import pc from "../../../public/pc.jpg";
import Image from "next/image";
import Link from "next/link";
import test from "../../../public/TBD.png";

export default function banner() {
  return (
    <div className="relative bg-black ">
      <div className="md:py-0 py-48">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center p-8">
          <div className="flex flex-col md:flex-row  gap-10  ">
            <div>
              <h2 className="text-5xl font-bold text-white">Iterative</h2>
              <p className="h2 my-5 text-lg text-white">
                Build amazing applications without writing a single line of
                code.
              </p>
              <Link
                href="/tool"
                className="bg-blue-500 text-white p-2 mr-4 rounded "
              >
                Try it out!
              </Link>
              <Link
                href="/auth"
                className="bg-blue-500 text-white p-2 rounded "
              >
                Sign up
              </Link>
            </div>
            <Image width={450} height={450} alt="main" src={test}></Image>
          </div>
        </div>
      </div>

      <Image src={pc} width={1920} height={1080} alt="Picture of the author" />
    </div>
  );
}

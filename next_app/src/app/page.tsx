"use client";
import Link from "next/link";
import Banner from "./components/banner";
import { Flowbite } from "flowbite-react";

export default function Home() {
  return (
    <Flowbite>
      <main className="flex min-h-screen flex-col">
        <Banner />
        <div className=" container mx-auto flex  w-2/3 flex-col items-center justify-center gap-24 py-20 text-center md:flex-row ">
          <div>
            <h2 className="text-5xl font-bold ">Iterative</h2>
            <p className="h2 my-5 text-lg ">
              Build amazing applications without writing a single line of code.
            </p>
            <Link
              href="/tool"
              className="mr-4 rounded bg-blue-500 p-2 text-white "
            >
              Try it out!
            </Link>
            <Link href="/login" className="rounded bg-blue-500 p-2 text-white ">
              Sign Up
            </Link>
          </div>
        </div>
        <section id="features" className="flex justify-center py-7">
          <div className="  grid-row mx-10 grid gap-10 md:grid-cols-3">
            <div className="  mb-4 text-center">
              <div className="flex flex-row justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="h-6 w-6  "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                  />
                </svg>

                <h3 className="h4  fw-bold mb-2">Intuitive Interface</h3>
              </div>

              <p>
                Our tool provides a user-friendly interface that allows you to
                easily create and customize your applications.
              </p>
            </div>

            <div className="  mb-4 text-center">
              <div className="flex flex-row justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
                  />
                </svg>

                <h3 className="h4 fw-bold mb-2">No Coding Required</h3>
              </div>
              <p>
                You don&apos;t need any coding skills to build powerful and
                functional applications with our AI-powered tool.
              </p>
            </div>
            <div className=" mb-4 text-center">
              <div className="flex flex-row justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
                  />
                </svg>

                <h3 className="h4 fw-bold mb-2">Fast and Efficient</h3>
              </div>
              <p>
                Our tool leverages the power of AI to automate and streamline
                the application development process, saving you time and effort.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Flowbite>
  );
}

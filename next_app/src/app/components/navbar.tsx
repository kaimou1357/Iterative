"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  ShoppingCartIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import Image from "next/image";
import Link from "next/link";
import { useStytchUser, useStytch } from "@stytch/nextjs";

export default function Navbar() {
  const { user } = useStytchUser();
  const stytchClient = useStytch();

  const handleLogout = useCallback(() => {
    stytchClient.session.revoke();
  }, [stytchClient]);

  return (
    <Disclosure as="nav" className="bg-black">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-12 items-center justify-between ">
              <div className="flex items-center ">
                <div className="flex-shrink-0">
                  <Link
                    href={"/"}
                    className="mt-1 block h-auto w-auto text-white sm:hidden"
                  >
                    Iterative
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                    <Link
                      href="/"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-white"
                    >
                      Iterative
                    </Link>
                    <Link
                      href="/tool"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-white"
                    >
                      Create
                    </Link>
                    <Link
                      href="/projects"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-white"
                    >
                      Projects
                    </Link>
                    <Link
                      href="/Deployments"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-white"
                    >
                      Deployments
                    </Link>
                    <Link
                      href="/Contact"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-white"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">
                  {/* Profile dropdown */}
                  <div>
                    {user ? (
                      <Link
                        href="/"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-white"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </Link>
                    ) : (
                      // If bearerToken is null, show the Log In button
                      <Link
                        href="/login"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-white"
                      >
                        Log In
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}

              <Disclosure.Button
                as="a"
                href="/tool"
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:bg-gray-700 hover:text-white"
              >
                Create
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/projects"
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:bg-gray-700 hover:text-white"
              >
                Projects
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/Deployments"
                className=" block rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:bg-gray-700 hover:text-white"
              >
                Deployments
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/Contact"
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:bg-gray-700 hover:text-white"
              >
                Contact
              </Disclosure.Button>
            </div>

            {/* ////aqui */}
            <div>
              {user ? (
                <Disclosure.Button
                  as="a"
                  href="/signout"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  Sign Out
                </Disclosure.Button>
              ) : (
                // If bearerToken is null, show the Log In button
                <Disclosure.Button
                  as="a"
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  Log In
                </Disclosure.Button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

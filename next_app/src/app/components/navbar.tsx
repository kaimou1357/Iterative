"use client";
import { Fragment, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useStytchUser, useStytch } from "@stytch/nextjs";
import { Button, Navbar } from "flowbite-react";

export default function AppNavbar() {
  const { user } = useStytchUser();
  const stytchClient = useStytch();

  const handleLogout = useCallback(() => {
    stytchClient.session.revoke();
  }, [stytchClient]);

  const isAuthenticated = user !== null;

  return (
    <Navbar fluid>
      <Navbar.Brand href="/">
        <img
          src="/favicon.png"
          className="mr-3 h-6 sm:h-9"
          alt="Iterative Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Iterative
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {isAuthenticated ? (
          <Button onClick={handleLogout} href="">
            Sign Out
          </Button>
        ) : (
          <Button href="/login">Log In</Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/tool">Create</Navbar.Link>
        {isAuthenticated ? (
          <>
            <Navbar.Link href="/projects">Projects</Navbar.Link>
            <Navbar.Link href="/deployments">Deployments</Navbar.Link>
          </>
        ) : (
          <>
            <Navbar.Link href="/login">Projects</Navbar.Link>
            <Navbar.Link href="/login">Deployments</Navbar.Link>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

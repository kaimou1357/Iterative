import React from "react";

export default function footer() {
  return (
    <footer className="bg-white mt-16 mb-10">
      <div className=" text-center      mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8                font-thin w-full flex items-center justify-center">
        <div className="row">
          <div className="col-lg-6">
            <p className="mb-0  mt-0">
              &copy; 2023 Iterative. All rights reserved.
            </p>
          </div>
          <div className="col-lg-6">
            <a href="#" className="me-3">
              Privacy Policy
            </a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

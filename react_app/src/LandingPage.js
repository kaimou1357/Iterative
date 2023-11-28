import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const LandingPage = () => {
    const imageURL = process.env.PUBLIC_URL + '/TBD.png';
    const { isAuthenticated, isGuest } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated || isGuest) {
          navigate('/wireframe-tool');
        }
      }, [isAuthenticated, isGuest, navigate]);

    return (
        <div className="d-flex flex-column vh-100 justify-content-between">
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <a className="navbar-brand" href="#">Iterative</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#features">Features</a>
                            </li>
                            {/* <li className="nav-item">
                                <a className="nav-link" href="#">Pricing</a>
                            </li> */}
                            <li className="nav-item">
                                <a className="nav-link" href="mailto:omshaik10@gmail.com">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <header className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-3">Iterative</h1>
                            <p className="h2 mb-4">
                                Build amazing applications without writing a single line of
                                code.
                            </p>
                            <NavLink to="/auth" className="btn btn-primary m-2">Get Started</NavLink>
                        </div>
                        <div className="col-lg-6">
                            <img src={imageURL} alt="TBD" className="img-fluid w-100"/>
                        </div>
                    </div>
                </div>
            </header>

            <section id="features" className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 text-center mb-4">
                            <i className="bi bi-lightbulb display-4 mb-3"></i>
                            <h3 className="h4 fw-bold mb-2">Intuitive Interface</h3>
                            <p>
                                Our tool provides a user-friendly interface that allows you to
                                easily create and customize your applications.
                            </p>
                        </div>
                        <div className="col-lg-4 text-center mb-4">
                            <i className="bi bi-puzzle display-4 mb-3"></i>
                            <h3 className="h4 fw-bold mb-2">No Coding Required</h3>
                            <p>
                                You don't need any coding skills to build powerful and
                                functional applications with our AI-powered tool.
                            </p>
                        </div>
                        <div className="col-lg-4 text-center mb-4">
                            <i className="bi bi-lightning display-4 mb-3"></i>
                            <h3 className="h4 fw-bold mb-2">Fast and Efficient</h3>
                            <p>
                                Our tool leverages the power of AI to automate and streamline
                                the application development process, saving you time and
                                effort.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="py-5">
                <div className="container">
                    <h2 className="h2 fw-bold text-center mb-5">Pricing</h2>
                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <div className="card border-0 shadow text-center p-4">
                                <h3 className="h4 fw-bold mb-3">Basic</h3>
                                <div className="h2 mb-4">
                                    <span className="fs-4">$</span>19<span className="fs-4">/month</span>
                                </div>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-2">10 Projects</li>
                                    <li className="mb-2">100 GB Storage</li>
                                    <li className="mb-2">Basic Support</li>
                                </ul>
                                <button className="btn btn-primary">Choose Plan</button>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-4">
                            <div className="card border-0 shadow text-center p-4">
                                <h3 className="h4 fw-bold mb-3">Pro</h3>
                                <div className="h2 mb-4">
                                    <span className="fs-4">$</span>49<span className="fs-4">/month</span>
                                </div>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-2">Unlimited Projects</li>
                                    <li className="mb-2">500 GB Storage</li>
                                    <li className="mb-2">Premium Support</li>
                                </ul>
                                <button className="btn btn-primary">Choose Plan</button>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-4">
                            <div className="card border-0 shadow text-center p-4">
                                <h3 className="h4 fw-bold mb-3">Enterprise</h3>
                                <div className="h2 mb-4">
                                    <span className="fs-4">$</span>99<span className="fs-4">/month</span>
                                </div>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-2">Unlimited Projects</li>
                                    <li className="mb-2">1 TB Storage</li>
                                    <li className="mb-2">Premium Support</li>
                                </ul>
                                <button className="btn btn-primary">Choose Plan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            <footer className="py-4">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-lg-6">
                            <p className="mb-0">&copy; 2023 Iterative. All rights reserved.</p>
                        </div>
                        <div className="col-lg-6">
                            <a href="#" className="me-3">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import AnonymousWireframeTool from './AnonymousWireframeTool';

const LandingPage = () => {
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
                    <a className="navbar-brand text-white" href="#">Iterative</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

            <header className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <h1 className="display-4 fw-bold mb-3">Iterative</h1>
                            <p className="h2 mb-4">
                                Build amazing applications without writing a single line of
                                code.
                            </p>
                            <NavLink to="/auth" className="btn btn-primary m-2">Sign Up</NavLink>
                        </div>
                        <div className="col-lg-8">
                          <AnonymousWireframeTool />
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
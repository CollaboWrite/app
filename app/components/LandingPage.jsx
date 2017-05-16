import React from 'react'
import { Link } from 'react-router'

const LandingPage = () => (
    <div id='landing-page'>
        <div id="content-wrapper" className="mui--text-center">
            <div className="landing-page-top">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="mui--text-display3"><h1 id='app-title'>CollaboWrite</h1></div>
            <br />
            <br />
            <Link to='/login'><button className="mui-btn mui-btn--raised">Get started</button></Link>
            </div>
            <br />
            <br />
            <div className="container">
                <div id="landing-page-info">
                    <h3 className="panel-head">CollaboWrite is a web-based application that allows writers to view, edit, and collaborate on long documents. Collaborators can chat with one another, manage, and make edits on multiple projects together.</h3>
                </div>
            </div>
        </div>
        <footer>
            <div className="mui-container mui--text-center">
                Made with ♥ by Kate Caldwell, Sarah Herr, Arin Choi and Jodie Ly
                </div>
        </footer>
    </div>
)

export default LandingPage


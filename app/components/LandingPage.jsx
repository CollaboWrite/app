import React from 'react'
import { Link } from 'react-router'

const LandingPage = () => (
    <div id='landing-page'>
        <div id="content-wrapper" className="mui--text-center">
            <div className="mui--appbar-height"></div>
            <br />
            <br />
            <div className="mui--text-display3">CollaboWrite</div>
            <br />
            <br />
            <Link to='/login'><button className="mui-btn mui-btn--raised">Get started</button></Link>
        </div>
        <footer>
            <div className="mui-container mui--text-center">
                Made with ♥ by Kate Caldwell, Sarah Herr, Arin Choi and Jodie Ly
                </div>
        </footer>
    </div>
)

export default LandingPage


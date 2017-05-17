import React from 'react'
import { Link } from 'react-router'
import WhoAmI from './WhoAmI'

const LandingPage = () => (
    <div id='landing-page'>
        <div id="content-wrapper" className="mui--text-center">
            <div className="landing-page-top">
                <WhoAmI />
            </div>
            <div className="container">
                <div id="landing-page-info">
                    <h3 className="panel-head">CollaboWrite is a web-based application that allows writers to view, edit, and collaborate on long documents. Collaborators can chat with one another, manage, and make edits on multiple projects together.</h3>
                </div>
            </div>
        </div>
        <footer>
            <div className="mui-container mui--text-center">
                Made by Kate Caldwell, Sarah Herr, Arin Choi and Jodie Ly
                </div>
        </footer>
    </div>
)

export default LandingPage


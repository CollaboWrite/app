'use strict'
import React from 'react'
import {Route, IndexRedirect, IndexRoute, Link} from 'react-router'

import Scratchpad from './scratchpad'


const Index = ({children}) => <div>
  <h1>Demos!</h1>
  <h2><Link to='demos/scratchpad/welcome'>Scratchpad</Link></h2>
  <p>
    The scratchpad is the very simplest React/Firebase demo—a text area
    whose content is synced with Firebase.
  </p>

</div>

export default <Route path="/" component={({children}) => children}>
  <IndexRoute component={Index}/>
  <Route path='/write/:title' component={Scratchpad}/>
</Route>

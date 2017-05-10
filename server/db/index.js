const firebase = require('firebase')

// -- // -- // -- // Firebase Config // -- // -- // -- //
const config = {
  apiKey: 'AIzaSyD6m_QmW1R8w6bBu1R1qnhnDqCNWMGS4Es',
  authDomain: 'capstone-c9e61.firebaseapp.com',
  databaseURL: 'https://capstone-c9e61.firebaseio.com',
  projectId: 'capstone-c9e61',
  storageBucket: 'capstone-c9e61.appspot.com',
  messagingSenderId: '395040208448'
}
// -- // -- // -- // -- // -- // -- // -- // -- // -- //

// Initialize the app, but make sure to do it only once.
//   (We need this for the tests. The test runner busts the require
//   cache when in watch mode; this will cause us to evaluate this
//   file multiple times. Without this protection, we would try to
//   initialize the app again, which causes Firebase to throw.
//
//   This is why global state makes a sad panda.)
firebase.__bonesApp || (firebase.__bonesApp = firebase.initializeApp(config))

module.exports = firebase

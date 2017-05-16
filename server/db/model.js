const firebase = require('firebase')
const db = firebase.database()

const atomRef = (projectId, atomId) =>
    projectRef(projectId).child('atoms').child(atomId)

const projectRef = (projectId) =>
    db.ref('projects').child(projectId).child('current')

module.exports = { atomRef, projectRef }

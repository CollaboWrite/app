const firebase = require('firebase')
const db = firebase.database()

const atomRef = (projectId, atomId) =>
    projectRef(projectId).child('atoms').child(atomId)

const projectRef = (projectId) =>
    db.ref('projects').child(projectId).child('current')

const snapshotRef = (projectId, snapshotId, atomId) =>
    db.ref('projects').child(projectId).child('snapshots').child(snapshotId).child('current').child('atoms').child(atomId).child('text')

const userRef = (userId) =>
    db.ref('users').child(userId)

module.exports = { atomRef, projectRef, snapshotRef, userRef }

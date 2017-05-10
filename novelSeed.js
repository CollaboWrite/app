const {parseString} = require('xml2js')
const fs = require('fs')
const db = require('./server/db')

const loadScriv = (fileName) => new Promise((resolve, reject) => fs.readFile(fileName, (err, buffer) => {
    if (err) reject(err)
    parseString(buffer.toString(), {attrkey: '@'}, (err, project) => {
        if (err) reject(err)
        resolve(project)
    })
}))

const importProject = (fileName) =>
    loadScriv(fileName)
        .then(project => db.database().ref('projects').push(project))

const main = ([node, self, scrivFile]) =>
    db.auth().signInAnonymously()
        .then(() => importProject(scrivFile))
        .then((importedProject) => console.log(importedProject))
        .catch(console.error)

module.exports = importProject

if (module===require.main) main(process.argv)
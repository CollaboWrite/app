const { parseString } = require('xml2js')
const fs = require('fs')
const db = require('./server/db')
const glob = require('glob-promise')
const Promise = require('bluebird')
const textract = require('textract')


const importScrivenerProject = loadDoc => ({ ScrivenerProject: project }) => {
  // atoms: Array<Promise<Atom>>
  const atoms = []
  const makeAtom = scrivObj => {
    atoms.push(Promise.props({
      title: scrivObj.Title[0],
      text: loadDoc(scrivObj.atom.ID + '.rtf'),
      summary: loadDoc(scrivObj.atom.ID + '_synopsis.txt'),
      notes: loadDoc(scrivObj.atom.ID + '_notes.rtf'),
      type: scrivObj.atom.Type,
      children: (scrivObj.Children
        ? scrivObj.Children[0].BinderItem
          .map(makeAtom)
          .reduce((all, id) => Object.assign(all, { [id]: true }), {})
        : null)
    }))
    return atoms.length - 1
  }

  // This currently points to the First Draft of Ella & Maritza in Kate's Novel2.scriv directory
  const manuscript = project.Binder[0].BinderItem[1].Children[0].BinderItem[1]

  return Promise.props({ root: makeAtom(manuscript), atoms: Promise.all(atoms) })
}

const loadScrivX = (fileName) => new Promise((resolve, reject) => fs.readFile(fileName, (err, buffer) => {
  if (err) reject(err)
  parseString(buffer.toString(), { attrkey: 'atom' }, (err, project) => {
    if (err) reject(err)
    resolve(project)
  })
}))

const importProject = (folder) => {
  // This parses the rtf files in the .scriv directory
  const loadDoc = (docName) => new Promise((resolve, reject) =>
    textract.fromFileWithPath(`${folder}/Files/Docs/${docName}`, (err, text) =>
      err ? resolve(null) : resolve(text)
    ))
  return glob(`${folder}/*.scrivx`)
    .then(([fileName]) => loadScrivX(fileName))
    .then(importScrivenerProject(loadDoc))
    .then(project => db.database().ref('projects').push(project))
}

const main = ([node, self, scrivFile]) =>
  db.auth().signInAnonymously()
    .then(() => importProject(scrivFile))
    .then((importedProject) => console.log(importedProject))
    .catch(console.error)

module.exports = importProject

if (module === require.main) main(process.argv)

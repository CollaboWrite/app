import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/server/db'
const db = firebase.database()


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

import Scratchpad from './Scratchpad'

// This component is a little piece of glue between React router
// and our Scratchpad component. It takes in props.params.title, and
// shows the Scratchpad along with that title.
export default class ScratchpadContainer extends React.Component {
  constructor(props) {
    super(props)
    this.testSpeech = this.testSpeech.bind(this)
  }

  testSpeech() {
    const title = this.props.routeParams.title
    const fireRef = db.ref(`scratchpads-${title}`)
    const recognition = new SpeechRecognition()
    const speechRecognitionList = new SpeechGrammarList()
    recognition.grammars = speechRecognitionList
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.start()

    recognition.onresult = function(event) {
      const speechCompiler = event.results[0][0].transcript
      // console.log(speechCompiler)
      fireRef.child('text').set(speechCompiler)
    }

    recognition.onspeechend = function() {
      recognition.stop()
    }

    recognition.onerror = function(event) {
      console.error('Error occurred in recognition: ' + event.error)
    }
  }

  render() {
    const title = this.props.routeParams.title
    const testBtn = document.querySelector('button')
    return (
      <div className='container'>
        <h1>{title}</h1>
        <h4>Either type text OR click the button and narrate text into the field.</h4>
        <div>
          <button className='speechBtn' onClick={this.testSpeech}>Speech to Text</button>
        </div>
        {/* Here, we're passing in a Firebase reference to
        /scratchpads/$scratchpadTitle. This is where the scratchpad is
        stored in Firebase. Each scratchpad is just a string that the
        component will listen to, but it could be the root of a more complex
        data structure if we wanted. */}
        <Scratchpad fireRef={db.ref(`scratchpads-${title}`).child('text')} /> 
      </div>
    )
  }
}


import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const fireRef = db.ref('scratchpads')

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

const diagnosticPara = document.querySelector('.output');
//




import Scratchpad from './Scratchpad'

// This component is a little piece of glue between React router
// and our Scratchpad component. It takes in props.params.title, and
// shows the Scratchpad along with that title.
export default class ScratchpadContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.testSpeech = this.testSpeech.bind(this)
  }

  testSpeech() {
    // testBtn.disabled = true;
    // testBtn.textContent = 'Speech in progress';
    // const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase + ';';
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    // speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event) {
      const speechCompiler = event.results[0][0].transcript;
      // render the speech in the Scratchpad
      console.log(speechCompiler)
      // get a snapshot.val()
      fireRef.set({'welcome': speechCompiler})
      // diagnosticPara.textContent = 'Speech received: ' + speechCompiler + '.';
    }

    recognition.onspeechend = function () {
      recognition.stop()
      // testBtn.disabled = false
      // testBtn.textContent = 'Speech to Text';
    }

    recognition.onerror = function (event) {
      // testBtn.disabled = false
      // testBtn.textContent = 'Speech to Text'
      diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error
    }
  }

  render() {
    const title = this.props.routeParams.title
    const testBtn = document.querySelector('button');
    return (
      <div>
        <h1>{title}</h1>
        <h2>Either type text or click the button and narrate text into the field.</h2>
        {/* Here, we're passing in a Firebase reference to
        /scratchpads/$scratchpadTitle. This is where the scratchpad is
        stored in Firebase. Each scratchpad is just a string that the
        component will listen to, but it could be the root of a more complex
        data structure if we wanted. */}
        <Scratchpad fireRef={fireRef.child(title)} />
        <div>
          <button className='speechBtn' onClick={this.testSpeech}>Speech to Text</button>
        </div>
      </div>
    )
  }
}


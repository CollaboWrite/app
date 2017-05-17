import React from 'react'
import SplitPane from 'react-split-pane'
import Editor from '../components/Editor'

const SplitView = (props) => {
    // console.log('Split View props', props)
    return (
        <div>
          {/*<div className='split-head'>
            <div id='split-view-left'>
              <h4 id='left-split-title'>SPLIT</h4>
            </div>
            <div id='split-view-right'>
              <h4 id='right-split-title'>TWO</h4>
            </div>
          </div>*/}
            <SplitPane className='splitPane split-view' defaultSize="50%" >
              <Editor atomRef={props.firstPrevAtomRef} pane={'firstPane'} selectPane={props.selectPane} />
              <Editor atomRef={props.secondPrevAtomRef} pane={'secondPane'} selectPane={props.selectPane} />
            </SplitPane>            
        </div>
    )
}

export default SplitView

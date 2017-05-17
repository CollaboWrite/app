import React from 'react'
import SplitPane from 'react-split-pane'
import Editor from '../components/Editor'

const SplitView = (props) => {
    return (
        <div>
          <SplitPane className='splitPane split-view' defaultSize="50%" >
            <Editor atomRef={props.firstPrevAtomRef} pane={'firstPane'} selectPane={props.selectPane} />
            <Editor atomRef={props.secondPrevAtomRef} pane={'secondPane'} selectPane={props.selectPane} />
          </SplitPane>            
        </div>
    )
}

export default SplitView

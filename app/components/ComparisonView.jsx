import React from 'react'
import SplitPane from 'react-split-pane'
import Editor from '../components/Editor'

const ComparisonView = (props) => {
    console.log('comparison view props', props)
    return(
        <div>
            <h3>Comparison View</h3>
            <button onClick={props.clickCompare}>Compare</button>
            {/*need to figure out how to select different versions & atoms*/}
            <SplitPane className='splitPane' defaultSize="50%" >
              <Editor atomRef={props.firstPrevAtomRef} pane={'firstPane'} selectPane={props.selectPane} />
              <Editor atomRef={props.secondPrevAtomRef} pane={'secondPane'} selectPane={props.selectPane} />
            </SplitPane>
            {/*need to figure out how to render the diffs*/}
            <div dangerouslySetInnerHTML={{__html: props.diffText}}></div>
        </div>
    )
}

export default ComparisonView


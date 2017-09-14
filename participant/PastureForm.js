import React, { Component } from 'react'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'

import { updateGrazing } from './actions'
import ProfitTable from './ProfitTable'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
  updateGrazing,
}

const mapStateToProps = ({ maxGrazingNum }) => ({
  maxGrazingNum
})

class PastureForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: 0,
    }
  }

  handleClick() {
    this.props.updateGrazing(this.state.value)
  }

  handleFocus(value) {
    this.setState({value: value})
  }

  handleBlur() {
    this.setState({value: 0})
  }

  render() {
    let list = []
    const { maxGrazingNum } = this.props
    for (let i = 1; i <= maxGrazingNum; ++i) {
      list.push(
        <RaisedButton
          key={i}
          label={i + multi_text["pasture_form"][3]}
          style={{marginLeft: '1px'}}
          onMouseLeave={this.handleBlur.bind(this)}
          onMouseEnter={this.handleFocus.bind(this, i)}
          onFocus={this.handleFocus.bind(this, i)}
          onClick={(() => {
            this.props.updateGrazing(i)
        })}/>)
    }
    return (<div>
      <p>{multi_text["pasture_form"][4]}</p>
      {list}
      <br /><br />
      <Paper>
        <br />
        <ProfitTable value={this.state.value} />
      </Paper>
   </div>)
  }
}

export default connect(mapStateToProps, actionCreators)(PastureForm)

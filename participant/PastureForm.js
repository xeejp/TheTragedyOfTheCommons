import React, { Component } from 'react'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'

import { updateGrazing } from './actions'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
  updateGrazing,
}

const mapStateToProps = ({ round, cost, maxGrazingNum, members, capacity }) => ({
  round,
  cost,
  maxGrazingNum,
  members,
  capacity,
})

class ProfitTable extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    // use as key
    let uuid = (function(){
      let S4 = () => ((((1+Math.random())*0x10000)|0).toString(16).substring(1))
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())
    })

    const { value, cost, maxGrazingNum, groupSize, capacity } = this.props
    const sumOfCattles = (groupSize - 1) * maxGrazingNum

    let header = []
    for (let i = 0; i <= sumOfCattles; ++i) {
      header.push(<th key={uuid()} style={{textAlign: 'center'}}>{i}</th>)
    }
    let body = []
    for (let i = 1; i <= maxGrazingNum; ++i) {
      let line = []
      line.push(<td key={uuid()} style={{borderRight: 'solid 1px silver'}}>{i}</td>)
      for (let j = 0; j <= sumOfCattles; j++) {
        line.push(<td key={uuid()} style={{textAlign: 'center'}}>{i * (capacity - (i + j)) - cost * i}</td>)
      }
      body.push(<tr key={uuid()} style={(value == i) ? {backgroundColor: '#f2f2f2'} : null}>{line}</tr>)
    }

    return (
      <Paper>
        <br />
        <table className="highlight">
          <caption>{multi_text["pasture_form"][0]}</caption>
          <thead>
            <tr>
              <th></th>
              <th style={{textAlign: 'center'}} colSpan={sumOfCattles - 2}>{multi_text["pasture_form"][1]}</th>
            </tr>
            <tr>
              <th key={uuid()}></th>
              <th key={uuid()} style={{borderRight: 'solid 1px silver'}}></th>
              {header}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style={{textAlign: 'center'}} rowSpan={maxGrazingNum + 1}>{multi_text["pasture_form"][2]}</th>
            </tr>
            {body}
          </tbody>
        </table>
      </Paper>
    )
  }
}

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
    const { round, cost, maxGrazingNum, members, capacity } = this.props
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
      <ProfitTable
        value={this.state.value}
        cost={cost}
        maxGrazingNum={maxGrazingNum}
        groupSize={members.length}
        capacity={capacity}
      />
   </div>)
  }
}

export default connect(mapStateToProps, actionCreators)(PastureForm)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import SelectField from 'material-ui/SelectField'
import Snackbar from 'material-ui/Snackbar'
import RaisedButton from 'material-ui/RaisedButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

import { updateGrazing } from './actions'

const actionCreators = {
  updateGrazing,
}

const mapStateToProps = ({ cost, maxGrazingNum, groups, capacity }) => ({
  cost,
  maxGrazingNum,
  groups,
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

    const { cost, maxGrazingNum, groupSize, capacity } = this.props
    const sumOfCattles = (groupSize - 1) * maxGrazingNum

    let header = []
    header.push(<th key={uuid()}></th>) // empty element
    header.push(<th key={uuid()} style={{borderRight: 'solid 1px silver'}}></th>) // empty element
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
      body.push(<tr key={uuid()}>{line}</tr>)
    }

    return (
      <Paper>
        <br />
        <table className="highlight">
          <caption>利益表</caption>
          <thead>
            <tr>
              <th></th>
              <th style={{textAlign: 'center'}} colSpan={sumOfCattles - 2}>自分以外の農家の放牧数の和</th>
            </tr>
            <tr>{header}</tr>
          </thead>
          <tbody>
          <tr>
            <th style={{textAlign: 'center'}} rowSpan={maxGrazingNum + 1}>自分の放牧数</th>
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
      open: false,
    }
  }

  handleChange(e, value) {
    this.setState({ value: value })
  }

  handleRequestOpen() {
    this.setState({open: true})
  }

  handleRequestClose() {
    this.setState({open: false})
  }

  render() {
    let list = []
    const { cost, maxGrazingNum, groups, capacity } = this.props
    for (let i = 1; i <= maxGrazingNum; ++i) {
      list.push(<RaisedButton key={i} label={i + "頭"} onClick={(() => {
        this.props.updateGrazing(i)
        this.handleRequestOpen()
      })} />)
    }
    return (<div>
      <p>放牧する牛の数を選択してください。</p>
      {list}
      <br /><br />
      <ProfitTable cost={cost} maxGrazingNum={maxGrazingNum} groupSize={groups.group.members.length} capacity={capacity} />
      <Snackbar
        open={this.state.open}
        message="送信しました。"
        autoHideDuration={4000}
        onRequestClose={this.handleRequestClose.bind(this)}
      />
   </div>)
  }
}

export default connect(mapStateToProps, actionCreators)(PastureForm)

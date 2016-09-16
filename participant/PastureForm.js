import React, { Component } from 'react'
import { connect } from 'react-redux'

import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import SelectField from 'material-ui/SelectField'
import RaisedButton from 'material-ui/RaisedButton'

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
        <table>
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
    this.state = { value: 0 }
  }

  onChange(e, value) {
    this.setState({ value: value })
  }

  onClick() {
    this.props.updateGrazing(this.state.value)
  }

  render() {
    let list = []
    const { cost, maxGrazingNum, groups, capacity } = this.props
    list.push(<MenuItem disabled={true} key={0} value={0} primaryText={"選択してください"} />)
    for (let i = 1; i <= maxGrazingNum; ++i) {
      list.push(<MenuItem key={i} value={i} primaryText={i + "頭"} />)
    }

    return (<div>
      <p>放牧する牛の数を選択してください。</p>
        <SelectField
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          style={{width: 200}}
        >
          {list}
        </SelectField>
      <RaisedButton label={"決定"} primary={true} onClick={this.onClick.bind(this)} />
      <br /><br />
      <ProfitTable cost={cost} maxGrazingNum={maxGrazingNum} groupSize={groups.group.members.length} capacity={capacity} />
   </div>)
  }
}

export default connect(mapStateToProps, actionCreators)(PastureForm)

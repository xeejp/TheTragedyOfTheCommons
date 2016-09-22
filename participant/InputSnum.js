import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateSnum } from './actions'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

const actionCreators = {
  updateSnum,
}
const mapStateToProps = ({}) => ({})

class InputSnum extends Component {
  constructor(props){
    super(props)
    this.state = { snum: "" }
  }

  handleUpdate(event){
    this.setState({ snum: event.target.value })
  }

  submit() {
    if(this.state.snum != "") {
      this.props.updateSnum(this.state.snum.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0) }).replace(/[^\x01-\x7E]/g, "").trim())
    }
  }

  handleKeyDown(event) {
    if (event.key === "Enter" || event.keyCode === 13) { // Enter
      this.submit()
    }
  }

  render() {
    return (<div>
    <p>学籍番号を入力してください。</p>
    <TextField
      hintText={"学籍番号"}
      onChange={this.handleUpdate.bind(this)}
      onKeyDown={this.handleKeyDown.bind(this)}
    />
    <RaisedButton label={"送信"} primary={true} disabled={this.state.snum == ""} onClick={this.submit.bind(this)} />
   </div>)
  }
}

export default connect(mapStateToProps, actionCreators)(InputSnum)

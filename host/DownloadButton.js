import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import Snackbar from 'material-ui/Snackbar'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ page, participants, participantsNumber, maxGrazingNum, maxRound, capacity, cost, groupSize, groupsNumber, askStudentId }) => ({
  page,
  participants,
  participantsNumber,
  maxGrazingNum,
  maxRound,
  capacity,
  cost,
  groupSize,
  groupsNumber,
  askStudentId,
})

class DownloadButton extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = { open: false }
  }

  handleClick() {
    const { participants, participantsNumber, maxGrazingNum, maxRound, capacity, cost, groupSize, groupsNumber, askStudentId } = this.props
    const fileName = 'TheTragedyOfTheCommons.csv'

    let users = Object.keys(participants).map(id => {
      let user = participants[id]
      return (id + ',' + (askStudentId ? (user.id + ',') : '') + user.grazings.join(',') + ',' + user.profits.join(',') + ',' + user.profits.reduce((prev, curr) => prev + curr, 0) + ',' + user.group)
    })

    let colGrazing = Array.from(Array(maxRound).keys()).reduce((prev, curr, i) => (String(prev) + multi_text["download"]["dt"][1] + (i + 1) + multi_text["download"]["dt"][0]), '')
    let colProfit = Array.from(Array(maxRound).keys()).reduce((prev, curr, i) => (String(prev) + multi_text["download"]["dt"][2] + (i + 1) + multi_text["download"]["dt"][0]), '')

    let date = new Date()
    let content = multi_text["download"]["dt"][3]
      + multi_text["download"]["dt"][4] + date + '\n'
      + multi_text["download"]["ddt"][0] + participantsNumber + '\n'
      + multi_text["download"]["ddt"][1] + groupsNumber + '\n'
      + multi_text["download"]["ddt"][2] + groupSize + '\n'
      + multi_text["download"]["ddt"][3] + maxRound + '\n'
      + multi_text["download"]["ddt"][4] + maxGrazingNum + '\n'
      + multi_text["download"]["dddt"][0] + cost + '\n'
      + multi_text["download"]["dddt"][1] + capacity + '\n'
      + 'ID,' + (askStudentId ? multi_text["download"]["dddt"][2] : '') + colGrazing + colProfit + multi_text["download"]["dddt"][3]
      + users.join('\n') + '\n'
    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    let blob = new Blob([bom,content])
    let url = window.URL || window.webkitURL
    let blobURL = url.createObjectURL(blob)

    let a = document.createElement('a')
    a.download = fileName
    a.href = blobURL
    a.click()
    this.setState({open: true})
  }

  handleRequestClose() {
    this.setState({ open: false })
  }

  render() {
    const { page } = this.props
    return (
      <span>
        <FloatingActionButton
          onClick={this.handleClick.bind(this)}
          disabled={page != "result"}
          style={{marginLeft: '2%'}}
        >
          <FileDownloadIcon />
        </FloatingActionButton>
        <Snackbar
          open={this.state.open}
          message={multi_text["download"]["dddt"][4]}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </span>
    )
  }
}

export default connect(mapStateToProps)(DownloadButton)

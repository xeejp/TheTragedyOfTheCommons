import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'

const mapStateToProps = ({ page, participants, participantsNumber, maxGrazingNum, maxRound, capacity, cost, groupSize, groupsNumber }) => ({
  page,
  participants,
  participantsNumber,
  maxGrazingNum,
  maxRound,
  capacity,
  cost,
  groupSize,
  groupsNumber,
})

class DownloadButton extends Component {
  constructor(props, context) {
    super(props, context)
  }

  handleClick() {
    const { participants, participantsNumber, maxGrazingNum, maxRound, capacity, cost, groupSize, groupsNumber } = this.props
    const fileName = 'TheTragedyOfTheCommons.csv'

    let users = Object.keys(participants).map(id => {
      let user = participants[id]
      return (id + ',' + user.id + ',' + user.grazings.join(',') + ',' + user.profits.join(',') + ',' + user.profits.reduce((prev, curr) => prev + curr, 0) + ',' + user.group)
    })

    let colGrazing = Array.from(Array(maxRound).keys()).reduce((prev, curr, i) => (String(prev) + '放牧:' + (i + 1) + '回目,'), '')
    let colProfit = Array.from(Array(maxRound).keys()).reduce((prev, curr, i) => (String(prev) + '利益:' + (i + 1) + '回目,'), '')

    let date = new Date()
    let content = '共有地の悲劇\n'
      + '実験日,' + date + '\n'
      + '登録者数,' + participantsNumber + '\n'
      + 'グループ数,' + groupsNumber + '\n'
      + '1グループの人数,' + groupSize + '\n'
      + 'ラウンド数,' + maxRound + '\n'
      + '最大放牧可能数,' + maxGrazingNum + '\n'
      + '牛の価格,' + cost + '\n'
      + '牧草の量,' + capacity + '\n'
      + 'ID,学籍番号,' + colGrazing + colProfit + '合計利益,グループID\n'
      + users.join('\n') + '\n'

    let blob = new Blob([content])
    let url = window.URL || window.webkitURL
    let blobURL = url.createObjectURL(blob)

    let a = document.createElement('a')
    a.download = fileName
    a.href = blobURL
    a.click()
  }

  render() {
    const { page } = this.props
    return (
      <FloatingActionButton
        onClick={this.handleClick.bind(this)}
        disabled={page != "result"}
      >
        <FileDownloadIcon />
      </FloatingActionButton>
    )
  }
}

export default connect(mapStateToProps)(DownloadButton)

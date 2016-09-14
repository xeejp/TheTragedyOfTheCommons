import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'

const mapStateToProps = ({ participantsNumber }) => ({
  participantsNumber
})

class Waiting extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { participantsNumber } = this.props
    return (
      <Card>
        <CardTitle title="共有地の悲劇" subtitle="待機中"/>
        <CardText>
          <p>参加者の登録を待っています。(現在の参加者: {participantsNumber}人)</p>
          <p>この画面のまましばらくお待ち下さい。</p>
        </CardText>
        <div style={{textAlign: "center"}}>
          <CircularProgress size={2}/>
        </div>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(Waiting)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import Chip from 'material-ui/Chip'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import InputSnum from './InputSnum'
import PastureForm from './PastureForm'

import { updateGrazing, updateConfirm } from './actions'

const actionCreators = {
  updateConfirm,
}

const mapStateToProps = ({ profits, grazings, confirming, confirmed, maxRound, round, participantsNumber, id, answered, askStudentId }) => ({
  profits,
  grazings,
  confirmed,
  confirming,
  maxRound,
  round,
  participantsNumber,
  id,
  answered,
  askStudentId,
})

class Experiment extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  handleClose() {
    this.props.updateConfirm()
  }

  render() {
    const { confirming, confirmed, maxRound, round, participantsNumber, id, answered, profits, grazings, askStudentId } = this.props
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />
    ]
    return (
      <Card>
        <CardTitle title="共有地の悲劇" subtitle={"実験中" + (askStudentId ? " (学籍番号: " + (id ? id : "") + ")" : "")}/>
        <CardText>
          {(askStudentId && id == null)
            ? <InputSnum />
              : <div>
                <Chip style={{float: "left"}}>Current Round : {round + 1 + " / " + maxRound}</Chip>
                <Chip style={{float: "right"}}>Total Profit : {profits.reduce((acc, val) => acc + val, 0)}</Chip>
                <div style={{clear: "both"}}>
                  {(!answered)
                    ? <PastureForm />
                      : <div>
                        <p>他の参加者の回答を待機しています。しばらくお待ちください。</p>
                        <div style={{textAlign: "center"}}>
                          <CircularProgress />
                        </div>
                        <Dialog
                          title="放牧結果"
                          actions={actions}
                          modal={true}
                          open={confirming && !confirmed}
                        >
                          <p>{round+1}回目のラウンドが終了しました。</p>
                          <p>あなたの放牧数: {(grazings.length > round) ? grazings[round] : 0}頭</p>
                          <p>あなたの利益: {(profits.length > round) ? profits[round] : 0}</p>
                          <p>次のページに移動します。</p>
                        </Dialog>
                      </div>
                  }
                </div>
              </div>
          }
        </CardText>
      </Card>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(Experiment)

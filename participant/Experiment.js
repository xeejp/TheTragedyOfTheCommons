import React, { Component } from 'react'
import { connect } from 'react-redux'

import Chip from 'material-ui/Chip'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'

import InputSnum from './InputSnum'
import PastureForm from './PastureForm'

const mapStateToProps = ({ profits, maxRound, round, participantsNumber, id, answered }) => ({
  profits,
  maxRound,
  round,
  participantsNumber,
  id,
  answered,
})

class Experiment extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { maxRound, round, participantsNumber, id, answered, profits } = this.props
    return (
      <Card>
        <CardTitle title="共有地の悲劇" subtitle={"実験中 (学籍番号: " + (id ? id : "") + ")"}/>
        <CardText>
          {(id == null)
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

export default connect(mapStateToProps)(Experiment)

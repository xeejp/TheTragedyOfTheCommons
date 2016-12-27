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

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

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
        <CardTitle title={multi_text["experiment"]["card"][0]} subtitle={multi_text["experiment"]["card"][1] + (askStudentId ? multi_text["experiment"]["card"][2] + (id ? id : "") + ")" : "")}/>
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
                        <p>{multi_text["experiment"]["end"]}</p>
                        <div style={{textAlign: "center"}}>
                          <CircularProgress />
                        </div>
                        <Dialog
                          title={multi_text["experiment"]["dialog"][0]}
                          actions={actions}
                          modal={true}
                          open={confirming && !confirmed}
                        >
                          <p>{round+1}{multi_text["experiment"]["dialog"][1]}</p>
                          <p>{multi_text["experiment"]["dialog"][2]}: {(grazings.length > round) ? grazings[round] : 0}{multi_text["experiment"]["dialog"][3]}</p>
                          <p>{multi_text["experiment"]["dialog"][4]}: {(profits.length > round) ? profits[round] : 0}</p>
                          <p>{multi_text["experiment"]["dialog"][5]}</p>
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

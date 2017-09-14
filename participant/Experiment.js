import React, { Component } from 'react'
import { connect } from 'react-redux'

import Chip from 'material-ui/Chip'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import InputSnum from './InputSnum'
import PastureForm from './PastureForm'
import GrazedResult from './GrazedResult'

import { updateGrazing, updateConfirm } from './actions'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
	updateConfirm,
}

const mapStateToProps = ({ profits, grazings, confirming, confirmed, confirms, maxRound, round, participantsNumber, id, answered, answers, askStudentId, groupSize, members }) => ({
	profits,
	grazings,
	confirmed,
	confirms,
	confirming,
	maxRound,
	round,
	participantsNumber,
	id,
	answered,
	answers,
	askStudentId,
	groupSize,
	members,
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
		const { confirming, confirmed, confirms, maxRound, round, participantsNumber, id, answered, answers, profits, grazings, askStudentId, groupSize, members } = this.props
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
								<Chip style={{float: "left"}}>{multi_text["experiment"]["round"] + " : " + ((round+1==maxRound)?multi_text["experiment"]["roundend"]:((round + 1) + " / " + maxRound))}</Chip>
								<Chip style={{float: "right"}}>{multi_text["experiment"]["profit"] + ":" + profits.reduce((acc, val) => acc + val, 0)}</Chip>
								<div style={{clear: "both"}}>
									{(!answered)
										? <PastureForm />
											: <div>
													<p>{multi_text["experiment"]["end"]}</p>
													{(confirming)?
														<p>(確認：{confirms}人/{members.length}人中)</p>
														:<p>(解答済み：{answers}人/{members.length}人中)</p>
													}
													<div style={{textAlign: "center"}}>
													<CircularProgress />
												</div>
												<Dialog
													title={multi_text["experiment"]["dialog"]}
													actions={actions}
													modal={true}
													open={confirming && !confirmed}
													autoScrollBodyContent={true}
												>
														<GrazedResult/>
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

import React, { Component } from 'react'
import { connect } from 'react-redux'

import Divider from 'material-ui/Divider'

import RaisedButton from 'material-ui/RaisedButton'

import { updateConfirm } from './actions'
import ProfitTable from './ProfitTable'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
	updateConfirm,
}

const mapStateToProps = ({ round, grazings, members, results, profits, groupProfits, confirming, confirmed, uid, maxRound}) => ({
	round,
	grazings,
	members,
	results,
	profits,
	groupProfits,
	confirming,
	confirmed,
	uid,
	maxRound,
})

const GrazedResultTable = ({style, grazing, anotherUsers, anotherUsersGrazings, profit}) => (
	<table>
		<thead>
			<tr>
				<th style={style}>{multi_text["experiment"]["fig"][0]}</th>
				<th style={style}></th>				
				<th style={style}>{multi_text["experiment"]["fig"][1]}</th>
				<th style={style}>{multi_text["experiment"]["fig"][2]}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td style={style}>{grazing}</td>
				<td>
				{
					anotherUsersGrazings && anotherUsersGrazings.map((val, idx) => (
						<td key={"u"+idx} style={style}>{val}</td>
					))
				}
				</td>
				<td style={style}>{anotherUsersGrazings.reduce((acc, val) => acc + val, 0)}</td>
				<td style={style}>{profit}</td>
			</tr>
		</tbody>
	</table>
)

class GrazedResult extends Component {
	constructor(props, context) {
		super(props, context)
		this.state = {}
	}

	handleClose() {
	this.props.updateConfirm()
  }

	render() {
		let list = []
		const { round, grazings, members, results, profits, groupProfits, confirming, confirmed, uid, maxRound} = this.props

		let anotherUsers = {}
		members.forEach(function(_id) {
			anotherUsers[_id] = results.participants[_id]
		})
		delete anotherUsers[uid]
		let anotherUsersGrazings=anotherUsersGrazings= Object.keys(anotherUsers).map(_id => anotherUsers[_id][round])
		
		let grazing = (grazings.length      > round) ? grazings[round]      : 0
		let profit  = (profits.length       > round) ? profits[round]       : 0

		return (
			<div>
				<p>{String(round + 1) + multi_text["experiment"]["result"][0]}</p>
				<GrazedResultTable
					style={{textAlign: "center"}}
					grazing={grazing}
					anotherUsers={anotherUsers}
					anotherUsersGrazings={anotherUsersGrazings} 
					profit={profit}
				/>
				<Divider
					style={{
						marginTop: '5%',
						marginBottom: '5%',
					}}
		  		/>
				
				{
					(round==0)?
						<p>今回の利益:{profit}ポイント</p>
						:<p>前回までの利益{profits.reduce((acc, val) => acc + val, 0) - profit}ポイント＋今回の利益{profit}ポイント ＝合計　{profits.reduce((acc, val) => acc + val, 0)}ポイント</p>
				}
				{(maxRound - round - 1 ==0)?
						<p>これで実験は終了です。</p>
				 :(maxRound - round - 1 ==1)?
				 		<p>次が最後のラウンドです。</p>
						:<p>あと{maxRound - round - 1}ラウンドあります。</p>
				}
				<br/>
				<ProfitTable 
					value={grazing} 
					lineValue = {anotherUsersGrazings.reduce((acc, val) => acc + val, 0)}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps, actionCreators)(GrazedResult)

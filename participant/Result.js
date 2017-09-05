import React, { Component } from 'react'
import { connect } from 'react-redux'

import Divider from 'material-ui/Divider'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'

import Graph from '../shared/Graph'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'
import Rank from '../shared/Rank'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ profits, maxRound, groupProfits, grazings, uid, results, askStudentId, members }) => ({
  profits,
  maxRound,
  groupProfits,
  grazings,
  uid,
  results,
  askStudentId,
  members,
})

const Round = ({ index, grazing, profit, groupProfit, style, anotherUsersGrazings }) => (
  <tr>
    <td style={style}>{index}</td>
    <td className="blue lighten-5" style={style}>{grazing}</td>
    {
      anotherUsersGrazings && anotherUsersGrazings.map((val, idx) => (
        <td key={'round' + (index * 10) + idx} style={style}>{val}</td>
      ))
    }
    <td style={style}>{anotherUsersGrazings.reduce((acc, val) => acc + val, 0)+grazing}</td>
    <td className="blue lighten-5" style={style}>{profit}</td>
    <td style={style}>{groupProfit}</td>
  </tr>
)

const ResultTable = ({ maxRound, grazings, profits, groupProfits, anotherUsers }) => (
  <table className="highlight">
    <thead>
      <tr>
        <th style={{textAlign: "center"}}>{multi_text["result"]["fig"][0]}</th>
        <th style={{textAlign: "center"}}>{multi_text["result"]["fig"][1]}</th>
        {
          Object.keys(anotherUsers).map((v, i) => (
            <th key={i} style={{textAlign: "center"}}>{multi_text["result"]["fig"][2] + String(i + 1) + multi_text["result"]["fig"][6]}</th>
          ))
        }
        <th style={{textAlign: "center"}}>{multi_text["result"]["fig"][3]}</th>
        <th style={{textAlign: "center"}}>{multi_text["result"]["fig"][4]}</th>
        <th style={{textAlign: "center"}}>{multi_text["result"]["fig"][5]}</th>
      </tr>
    </thead>
    <tbody>
      {
        Array.from(Array(maxRound).keys()).map((v, i, ary) => (
          <Round
            index={i + 1}
            grazing={grazings[i]}
            anotherUsersGrazings={
              Object.keys(anotherUsers).map(_id => (
                anotherUsers[_id][i]
              ))
            }
            profit={profits[i]}
            groupProfit={groupProfits[i]}
            key={i}
            style={{textAlign: "center"}}
          />
        ))
      }
      <Round
        index={multi_text["result"]["round"]}
        grazing={grazings.reduce((acc, val) => acc + val, 0)}
        anotherUsersGrazings={Object.keys(anotherUsers).map(_id => (
          anotherUsers[_id].reduce((acc, val) => acc + val, 0)
        ))}
        profit={profits.reduce((acc, val) => acc + val, 0)}
        groupProfit={groupProfits.reduce((acc, val) => acc + val, 0)}
        style={{borderTop: 'solid 1px silver', textAlign: "center"}}
      />
    </tbody>
  </table>
)

class Result extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { maxRound, profits, groupProfits, grazings, uid, results, askStudentId, members } = this.props
    let anotherUsers = {}
    members.forEach(function(_id) {
      anotherUsers[_id] = results.participants[_id]
    })
    delete anotherUsers[uid]
    return (
      <Card>
        <CardTitle title={multi_text["result"]["card"][0]} subtitle={multi_text["result"]["card"][1] + (askStudentId ? multi_text["result"]["card"][2] + (id ? id : "") + ")" : "")}/>
        <CardText>
          <p>{multi_text["result"]["card"][3]}</p>
          <ResultTable
            maxRound={maxRound}
            grazings={grazings}
            profits={profits}
            groupProfits={groupProfits}
            anotherUsers={anotherUsers}
          />
          <Divider
            style={{
              marginTop: '5%',
              marginBottom: '5%',
            }}
          />
          <Graph /><br />
          <Rank  my_profit={profits.reduce((acc, val) => acc + val, 0)}/><br />
        </CardText>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(Result)

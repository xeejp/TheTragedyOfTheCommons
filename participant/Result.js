import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'

const mapStateToProps = ({ profits, maxRound, groupProfits, grazings, id, results }) => ({
  profits,
  maxRound,
  groupProfits,
  grazings,
  id,
  results,
})

const Round = ({ index, grazing, profit, groupProfit, style, anotherUsersGrazings }) => (
  <tr>
    <td style={style}>{index}</td>
    <td style={style}>{grazing}</td>
    {
      anotherUsersGrazings && anotherUsersGrazings.map((val, idx) => (
        <td key={'round' + (index * 10) + idx} style={style}>{val}</td>
      ))
    }
    <td style={style}>{profit}</td>
    <td style={style}>{groupProfit}</td>
  </tr>
)

const ResultTable = ({ maxRound, grazings, profits, groupProfits, anotherUsers }) => (
  <table className="highlight">
    <thead>
      <tr>
        <th style={{textAlign: "center"}}>ラウンド</th>
        <th style={{textAlign: "center"}}>放牧数</th>
        {
          Object.keys(anotherUsers).map((v, i) => (
            <th key={i} style={{textAlign: "center"}}>{"ユーザー" + String(i + 1)}</th>
          ))
        }
        <th style={{textAlign: "center"}}>利益</th>
        <th style={{textAlign: "center"}}>グループ全体の利益</th>
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
        index={"合計"}
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
    const { maxRound, groupProfits, profits, grazings, id, results } = this.props
    delete results[id]
    return (
      <Card>
        <CardTitle title="共有地の悲劇" subtitle={"実験結果 (学籍番号: " + (id ? id : "") + ")"}/>
        <CardText>
          <p>以上で実験は終了になります。お疲れ様でした。</p>
          <ResultTable
            maxRound={maxRound}
            grazings={grazings}
            profits={profits}
            groupProfits={groupProfits}
            anotherUsers={results}
          />
        </CardText>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(Result)

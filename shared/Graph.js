import React, { Component } from 'react'
import { connect } from 'react-redux'
import throttle from 'react-throttle-render'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import Highcharts from 'react-highcharts'

const mapStateToProps = ({ results, maxRound, maxGrazingNum, groupSize }) => ({
  results,
  maxRound,
  maxGrazingNum,
  groupSize,
})

class Graph extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = { expanded: false }
  }

  handleExpandChange(expanded) {
    this.setState({expanded: expanded});
  }

  render() {
    const { results, maxRound, maxGrazingNum, groupSize } = this.props
    if (!results) return null
    let config = {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: '共有地の悲劇'
      },
      subtitle: {
        text: '実験結果'
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        title: {
          text: 'グループ内での自分以外の放牧数(平均)',
          enabled: true,
        },
        min: 0,
        max: maxGrazingNum * (groupSize - 1),
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: '自分の放牧数(平均)',
        },
        min: 0,
        max: maxGrazingNum,
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {
            headerFormat: '',
            pointFormat: '{point.x} 頭, {point.y} 頭'
          }
        }
      },
      exporting : {
        enabled: true
      },
      series: [{
        color: 'rgba(100, 200, 200, .5)',
        data: []
      }]
    }

    let data = []
    Object.keys(results.groups).forEach(group_id => {
      if (results.groups[group_id].group_status == 'result') {
        let members = results.groups[group_id].members.map(_id =>
            results.participants[_id].reduce((acc, val) => acc + val, 0)
        )
        let sum = members.reduce((acc, val) => acc + val, 0)

        members.forEach(member => {
          data.push(
            [(sum - member) / maxRound, (member) / maxRound]
          )
        })
      }
    })

    config["series"][0]["data"] = data
    return (<div>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange.bind(this)}>
          <CardHeader title="グラフ" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <Highcharts config={config} />
            </CardText>
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps)(throttle(Graph, 200))

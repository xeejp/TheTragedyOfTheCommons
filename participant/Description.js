import React, { Component } from 'react'
import { connect } from 'react-redux'

import { finishDescription } from './actions'

import RaisedButton from 'material-ui/RaisedButton'
import SwipeableViews from 'react-swipeable-views'
import CircularProgress from 'material-ui/CircularProgress'
import {Card, CardHeader, CardText} from 'material-ui/Card'

const actionCreators = {
  finishDescription
}
const mapStateToProps = ({ description }) => ({
  description
})

class Description extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      slideIndex: 0,
    }
  }

  handleSlideIndex(value) {
    this.setState({
      slideIndex: value,
    })
  }

  handleNext() {
    this.setState({
      slideIndex: this.state.slideIndex + 1,
    })
  }

  handleBack() {
    this.setState({
      slideIndex: this.state.slideIndex - 1,
    })
  }

  render() {
    const { description } = this.props
    if (this.state.slideIndex == description.length) {
      this.props.finishDescription()
    }
    let descList = [
      <div>
        <CardHeader
          title="共有地の悲劇"
          subtitle={"ルールの説明 " + (description.length + 1) + "/" + (description.length + 1)}
        />
        <CardText expandable={false}>
          <p>実験が開始されるまで、しばらくお待ちください。</p>
          <div style={{textAlign: "center"}}>
            <CircularProgress />
          </div>
        </CardText>
      </div>
    ]
    return (
      <div>
        <Card style={{marginBottom: "5%"}}>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleSlideIndex.bind(this)}
          >
            {
              description.map((desc, index) => (
                <div key={index}>
                  <CardHeader
                    title="共有地の悲劇"
                    subtitle={"ルールの説明 " + (index+1) + "/" + (description.length + 1)}
                  />
                  <CardText expandable={false}>
                    {desc.text.split('\n').map( line => <p key={line}>{line}</p>)}
                  </CardText>
                </div>
              )).concat(descList)
            }
          </SwipeableViews>
        </Card>
        <RaisedButton
          label="戻る"
          style={{float: "left"}}
          onTouchTap={this.handleBack.bind(this)}
          disabled={this.state.slideIndex == 0}
        />
        <RaisedButton
          label="進む"
          style={{float: "right"}}
          onTouchTap={this.handleNext.bind(this)}
          primary={true}
          disabled={this.state.slideIndex == description.length}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(Description)

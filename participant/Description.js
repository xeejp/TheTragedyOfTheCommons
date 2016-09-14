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
const mapStateToProps = ({ message }) => ({
  message
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
    const { message } = this.props
    if (this.state.slideIndex == this.props.message.description.length) {
      this.props.finishDescription()
    }
    return (
      <div>
        <Card style={{marginBottom: "5%"}}>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleSlideIndex.bind(this)}
          >
            {
              message.description.map((description, index) => (
                <div key={index}>
                  <CardHeader
                    title="説明"
                    subtitle={(index+1) + "/" + (message.description.length+1)}
                  />
                  <CardText expandable={false}>
                    {description.text.split('\n').map( line => <p key={line}>{line}</p>)}
                  </CardText>
                </div>
              ))
            }
            <div>
              <CardHeader
                title="説明"
                subtitle={(message.description.length+1)+"/"+(message.description.length+1)}
              />
              <CardText expandable={false}>
                <p>実験が開始されるまでお待ちください</p>
                <div style={{textAlign: "center"}}>
                  <CircularProgress />
                </div>
              </CardText>
            </div>
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
          disabled={this.state.slideIndex == message.description.length}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(Description)

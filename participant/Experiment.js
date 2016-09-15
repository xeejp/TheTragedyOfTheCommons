import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'

import InputSnum from './InputSnum'

const mapStateToProps = ({ participantsNumber, id }) => ({
  participantsNumber,
  id,
})

class Experiment extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { participantsNumber, id } = this.props
    return (
      <Card>
        <CardTitle title="共有地の悲劇" subtitle="実験中"/>
        <CardText>
          {(id == null)
            ? <InputSnum />
            : <div></div>
          }
        </CardText>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(Experiment)

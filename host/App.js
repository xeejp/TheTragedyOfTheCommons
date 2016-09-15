import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from 'shared/actions'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'

import PageStepper from './PageStepper'

const actionCreators = {
  fetchContents
}
const mapStateToProps = ({ }) => ({
})

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    this.props.fetchContents();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
          <PageStepper />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(App)

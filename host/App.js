import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from 'shared/actions'

import Divider from 'material-ui/Divider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'

import PageStepper from './PageStepper'
import Users from './Users'
import DownloadButton from './DownloadButton'
import ResetButton from './ResetButton'
import ConfigEditor from './ConfigEditor'
import Graph from '../shared/Graph'

const actionCreators = {
  fetchContents
}
const mapStateToProps = ({ page }) => ({
  page
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
    const { page } = this.props
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
          <PageStepper />
          <Divider
            style={{
              marginTop: '5%',
              marginBottom: '5%',
            }}
          />
          <ResetButton />
          <DownloadButton />
          <ConfigEditor />
          <Divider
            style={{
              marginTop: '5%',
              marginBottom: '5%',
            }}
          />
          <Users />
          <Divider
            style={{
              marginTop: '5%',
              marginBottom: '5%',
            }}
          />
          {(page == "result") ? <Graph /> : null}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(App)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from 'shared/actions'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'

import Waiting from './Waiting'
import Description from './Description'

const actionCreators = {
  fetchContents
}

const mapStateToProps = ({ page, joinable, group }) => ({
  page,
  joinable,
  group,
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
    const { page, joinable, group } = this.props
    console.log(this.props)
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
        { joinable || group != null
          ? <div>
              { (page == "waiting") ? <Waiting /> : null }
              { (page == "description") ? <Description /> : null }
          </div>
          : <Card>
              <CardTitle title="共有地の悲劇" subtitle="実験中"/>
              <CardText>
                <p>実験はすでに開始されています。</p>
                <p>実験が終了するまでお待ちください。</p>
              </CardText>
          </Card>
        }
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(App)

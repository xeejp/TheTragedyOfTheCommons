import React, { Component } from 'react'
import { connect } from 'react-redux'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ReplayIcon from 'material-ui/svg-icons/av/replay'
import Snackbar from 'material-ui/Snackbar'

import { match } from './actions'

const actionCreators = {
  match
}

const mapStateToProps = ({ page }) => ({
  page,
})

class ResetButton extends Component {
  constructor(props){
    super(props)
    this.state = {
      snackOpen: false,
      dialogOpen: false,
    }
  }

  handleClick() {
    this.setState({ dialogOpen: true })
  }

  handleReset() {
    this.setState({
      snackOpen: true,
      dialogOpen: false,
    })
    this.props.match()
  }

  handleCloseDialog() {
    this.setState({ dialogOpen: false })
  }

  handleRequestClose() {
    this.setState({ snackOpen: false })
  }

  render() {
    const { page } = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onTouchTap={this.handleCloseDialog.bind(this)}
      />,
      <FlatButton
        label='Reset'
        primary={true}
        onTouchTap={this.handleReset.bind(this)}
      />,
    ]

    return (
      <span>
        <FloatingActionButton
          onClick={this.handleClick.bind(this)}
          style={{marginLeft: "5%"}}
          secondary={true}
          disabled={page == 'result'}
        >
          <ReplayIcon />
        </FloatingActionButton>
        <Dialog
          title='確認'
          actions={actions}
          modal={true}
          open={this.state.dialogOpen}
        >
          実験をリセットします。現在の実験結果は削除されますが、よろしいですか？(実験の設定は削除されません)
        </Dialog>
        <Snackbar
          open={this.state.snackOpen}
          message={'実験をリセットしました。'}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </span>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(ResetButton)

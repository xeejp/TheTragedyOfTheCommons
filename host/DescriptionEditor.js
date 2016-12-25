import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {Card} from 'material-ui/Card'
import Snackbar from 'material-ui/Snackbar'

import ImageEditIcon from 'material-ui/svg-icons/image/edit'
import ImageAddIcon from 'material-ui/svg-icons/content/add'
import ImageDeleteIcon from 'material-ui/svg-icons/action/delete'

import { updateDescription } from './actions'

import { ReadJSON } from '../shared/ReadJSON'

const actionCreators = {
  updateDescription,
}

const mapStateToProps = ({ page, description }) => ({
  page,
  description,
})

class DescriptionEditor extends Component {
  constructor(props, context) {
    super(props, context)
    const { description } = this.props
    var default_text = description
    if(!description) {
      default_text = ReadJSON().dynamic_text
      this.props.updateDescription(default_text)
    }
    this.state = {
      isOpenDialog: false,
      isOpenSnackbar: false,
      disabled: false,
      snackbarMessage: "",
      defaultDescription: default_text,
      description: [
        {id: 0, text: ""},
      ],
    }
  }

  handleOpen() {
    this.setState({
      isOpenDialog: true,
      description: this.props.description,
    })
  }

  handleClose() {
    this.setState({
      isOpenDialog: false
    })
  }

  handleRequestClose() {
    this.setState({
      isOpenSnackbar: false,
    })
  }

  deleteDescription(index) {
    let description = Object.assign([], this.state.description)
    description.splice(index, 1)
    this.setState({description: description})
  }

  addDescription() {
    let description = Object.assign([], this.state.description)
    let maxId = description.reduce((prev, curr) => Math.max(prev, curr.id), 0)
    description.push({id: maxId + 1, text: ""})
    this.setState({description: description})
  }

  handleChange(index, event, value) {
    let description = Object.assign([], this.state.description)
    description[index] = {id: index, text: value}
    this.setState({description: description})
  }

  submit() {
    this.setState({
      isOpenDialog: false,
      isOpenSnackbar: true,
      snackbarMessage: "設定を送信しました",
    })
    let description = this.state.description.map((v, i, ary) => ({id: i, text: v.text}))
    this.setState({description: description})
    this.props.updateDescription(description)
  }

  reset() {
    this.setState({
      isOpenDialog: false,
      isOpenSnackbar: true,
      snackbarMessage: "設定を初期化しました",
    })
    this.props.updateDescription(this.state.defaultDescription)
  }

  render() {
    const { page, description } = this.props
    const actions = [
      <RaisedButton
        label="適用"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.submit.bind(this)}
        disabled={this.state.disabled}
      />,
      <RaisedButton
        label="キャンセル"
        onTouchTap={this.handleClose.bind(this)}
      />,
      <RaisedButton
        label="初期化"
        onTouchTap={this.reset.bind(this)}
      />
    ]
    return (
      <span>
        <FloatingActionButton
          onClick={this.handleOpen.bind(this)}
          disabled={page != "waiting"}
          style={{marginLeft: '2%'}}
        >
          <ImageEditIcon />
        </FloatingActionButton>
        <Dialog
          title="説明文編集"
          actions={actions}
          model={false}
          open={this.state.isOpenDialog}
          autoScrollBodyContent={true}
        >
          <table>
            <tbody>
              {
                this.state.description.map((message, index) => (
                  <tr key={message.id}>
                    <td>
                      <TextField
                        hintText={"問題の説明"}
                        floatingLabelText={(index + 1) + "ページ目の説明文"}
                        defaultValue={message.text}
                        onChange={this.handleChange.bind(this, index)}
                        multiLine={true}
                        fullWidth={true}
                      />
                    </td>
                    <td>
                      <FloatingActionButton
                        mini={true}
                        onTouchTap={this.deleteDescription.bind(this, index)}
                        disabled={this.state.description.length <= 1}
                      >
                        <ImageDeleteIcon />
                      </FloatingActionButton>
                    </td>
                  </tr>
                ))
              }
              {
                  <tr>
                    <td>
                    </td>
                    <td>
                      <FloatingActionButton
                        mini={true}
                        secondary={true}
                        onTouchTap={this.addDescription.bind(this)}
                      >
                        <ImageAddIcon />
                      </FloatingActionButton>
                    </td>
                  </tr>
              }
            </tbody>
          </table>
        </Dialog>
        <Snackbar
          open={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </span>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(DescriptionEditor)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionSettingsIcon from 'material-ui/svg-icons/action/settings'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Card} from 'material-ui/Card'
import SwipeableViews from 'react-swipeable-views'
import Snackbar from 'material-ui/Snackbar'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'

import { updateConfig } from './actions'

const actionCreators = {
  updateConfig,
}

const mapStateToProps = ({ page, maxRound, cost, maxGrazingNum, capacity, groupSize }) => ({
  page,
  maxRound,
  cost,
  maxGrazingNum,
  capacity,
  groupSize
})

class ConfigEditor extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isOpenDialog: false,
      isOpenSnackbar: false,
      disabled: false,
      snackbarMessage: "",
      slideIndex: 0,
      defaultConfig: {
        maxRound: 4,
        cost: 2,
        maxGrazingNum: 3,
        groupSize: 4,
        capacity: 16,
      },
      cost: 2,
      capacity: 16,
      maxRound: 4,
      maxGrazingNum: 3,
      groupSize: 4,
    }
  }

  componentDidReceiveProps() {
    const { page, maxRound, cost, maxGrazingNum, capacity, groupSize } = this.props
    this.setState({
      cost: cost,
      capacity: capacity,
      maxRound: maxRound,
      maxGrazingNum: maxGrazingNum,
      groupSize: groupSize,
    })
  }

  handleOpen() {
    this.setState({
      config: this.props.config,
      isOpenDialog: true,
      slideIndex: 0,
    })
  }

  handleClose() {
    this.setState({
      config: this.props.config,
      isOpenDialog: false
    })
  }

  handleRequestClose() {
    this.setState({
      isOpenSnackbar: false,
    })
  }

  handleSlideIndex(value) {
    this.setState({
      slideIndex: value,
    })
  }

  handleChangeMaxRound(e, value) {
    if (!this.isValidNumber(value)) return
    this.setState({ maxRound: value })
  }

  handleChangeGroupSize(e, value) {
    if (!this.isValidNumber(value)) return
    this.setState({ groupSize: value })
  }

  handleChangeCapacity(e, value) {
    if (!this.isValidNumber(value)) return
    this.setState({ capacity: value })
  }

  handleChangeMaxGrazingNum(e, value) {
    if (!this.isValidNumber(value)) return
    this.setState({ maxGrazingNum: value })
  }

  handleChangeCost(e, value) {
    if (!this.isValidNumber(value)) return
    this.setState({ cost: value })
  }

  isValidNumber(value) {
    if (isNaN(value) || value.indexOf('.') != -1 || parseInt(value) <= 0 || 100000 < parseInt(value)) {
      this.setState({ disabled: true })
      return false
    }
    this.setState({ disabled: false })
    return true
  }

  submit() {
    this.setState({
      isOpenDialog: false,
      isOpenSnackbar: true,
      snackbarMessage: "設定を送信しました",
    })
    let config = {
      maxRound: this.state.maxRound,
      groupSize: this.state.groupSize,
      capacity: this.state.capacity,
      maxGrazingNum: this.state.maxGrazingNum,
      cost: this.state.cost,
    }
    this.props.updateConfig(config)
  }

  reset() {
    this.setState({
      isOpenDialog: false,
      isOpenSnackbar: true,
      snackbarMessage: "設定を初期化しました",
    })
    this.props.updateConfig(this.state.defaultConfig)
  }

  render() {
    const { page, maxRound, cost, maxGrazingNum, capacity, groupSize } = this.props
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
          style={{marginLeft: '5%'}}
        >
          <ActionSettingsIcon />
        </FloatingActionButton>
        <Dialog
          title="設定編集"
          actions={actions}
          model={false}
          open={this.state.isOpenDialog}
          autoScrollBodyContent={true}
        >
          <p>ラウンド数</p>
          <TextField
            hintText={"ラウンド数(正の整数)"}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeMaxRound.bind(this)}
            value={this.state.maxRound}
          />

          <p>１グループの人数</p>
          <TextField
            hintText={"グループの人数(正の整数)"}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeGroupSize.bind(this)}
            value={this.state.groupSize}
          />

          <p>放牧地の草の量</p>
          <TextField
            hintText={"牧草の量(正の整数)"}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeCapacity.bind(this)}
            value={this.state.capacity}
          />

          <p>農家が購入できる仔牛の数</p>
          <TextField
            hintText={"仔牛の数(正の整数)"}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeMaxGrazingNum.bind(this)}
            value={this.state.maxGrazingNum}
          />

          <p>仔牛の価格</p>
          <TextField
            hintText={"仔牛の価格(正の整数)"}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeCost.bind(this)}
            value={this.state.cost}
          />
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

export default connect(mapStateToProps, actionCreators)(ConfigEditor)

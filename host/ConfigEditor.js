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
import Toggle from 'material-ui/Toggle'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'

import { updateConfig, visit } from './actions'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
  updateConfig,
  visit
}

const mapStateToProps = ({ page, maxRound, cost, maxGrazingNum, capacity, groupSize, askStudentId, isFirstVisit }) => ({
  page,
  maxRound,
  cost,
  maxGrazingNum,
  capacity,
  groupSize,
  askStudentId,
  isFirstVisit
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
        askStudentId: false,
      },
      cost: 2,
      capacity: 16,
      maxRound: 4,
      maxGrazingNum: 3,
      groupSize: 4,
      askStudentId: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { page, maxRound, cost, maxGrazingNum, capacity, groupSize, askStudentId, isFirstVisit, visit } = nextProps
    const open = isFirstVisit || this.state.isOpenDialog
    if (isFirstVisit) {
      visit()
    }
    this.setState({
      cost: cost,
      capacity: capacity,
      maxRound: maxRound,
      maxGrazingNum: maxGrazingNum,
      groupSize: groupSize,
      askStudentId: askStudentId,
      isOpenDialog: open
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

  handleChangeAskStudentId(e, value) {
    this.setState({ askStudentId: value })
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
      snackbarMessage: multi_text["snackbar"][0],
    })
    let config = {
      maxRound: this.state.maxRound,
      groupSize: this.state.groupSize,
      capacity: this.state.capacity,
      maxGrazingNum: this.state.maxGrazingNum,
      cost: this.state.cost,
      askStudentId: this.state.askStudentId
    }
    this.props.updateConfig(config)
  }

  reset() {
    this.setState({
      isOpenDialog: false,
      isOpenSnackbar: true,
      snackbarMessage: multi_text["snackbar"][1],
    })
    this.props.updateConfig(this.state.defaultConfig)
  }

  render() {
    const { page, maxRound, cost, maxGrazingNum, capacity, groupSize, askStudentId } = this.props
    const actions = [
      <RaisedButton
        label={multi_text["config_button"][0]}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.submit.bind(this)}
        disabled={this.state.disabled}
      />,
      <RaisedButton
        label={multi_text["config_button"][1]}
        onTouchTap={this.handleClose.bind(this)}
        />,
      <RaisedButton
        label={multi_text["config_button"][2]}
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
          <ActionSettingsIcon />
        </FloatingActionButton>
        <Dialog
          title={multi_text["config_editor"]["dt"][0]}
          actions={actions}
          model={false}
          open={this.state.isOpenDialog}
          autoScrollBodyContent={true}
        >
          <p>{multi_text["config_editor"]["dt"][1]}</p>
          <Toggle
            label={multi_text["config_editor"]["dt"][1]+ (this.state.askStudentId ? multi_text["config_editor"]["dt"][2] : multi_text["config_editor"]["dt"][3])}
            toggled={this.state.askStudentId}
            onToggle={this.handleChangeAskStudentId.bind(this)}
          />

          <p>{multi_text["config_editor"]["dt"][4]}</p>
          <TextField
            hintText={multi_text["config_editor"]["ddt"][0]}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeMaxRound.bind(this)}
            value={this.state.maxRound}
          />

          <p>{multi_text["config_editor"]["ddt"][1]}</p>
          <TextField
            hintText={multi_text["config_editor"]["ddt"][2]}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeGroupSize.bind(this)}
            value={this.state.groupSize}
          />

          <p>{multi_text["config_editor"]["ddt"][3]}</p>
          <TextField
            hintText={multi_text["config_editor"]["ddt"][4]}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeCapacity.bind(this)}
            value={this.state.capacity}
          />

          <p>{multi_text["config_editor"]["dddt"][0]}</p>
          <TextField
            hintText={multi_text["config_editor"]["dddt"][1]}
            multiLine={false}
            fullWidth={true}
            onChange={this.handleChangeMaxGrazingNum.bind(this)}
            value={this.state.maxGrazingNum}
          />

          <p>{multi_text["config_editor"]["dddt"][2]}</p>
          <TextField
            hintText={multi_text["config_editor"]["dddt"][3]}
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

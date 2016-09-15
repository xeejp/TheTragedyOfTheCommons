import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Badge from 'material-ui/Badge'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import PersonIcon from 'material-ui/svg-icons/social/person'
import PeopleIcon from 'material-ui/svg-icons/social/people'

import { openParticipantPage } from './actions'

const User = ({ id, profit, grazingNum, openParticipantPage, status }) => (
  <tr>
    <td><a onClick={openParticipantPage(id)}>{id}</a></td>
    <td>{profit}</td>
    <td>{grazingNum}</td>
    <td>{status}</td>
  </tr>
)

const UsersList = ({participants, openParticipantPage}) => (
  <table>
    <thead><tr><th>ID</th><th>Profit</th><th>Grazing Num</th><th>Status</th></tr></thead>
    <tbody>
      {
        Object.keys(participants).map(id => (
          <User
            key={id}
            id={participants[id].id != null ? participants[id].id : id}
            profit={participants[id].profit}
            grazingNum={participants[id].grazingNum}
            openParticipantPage={openParticipantPage}
            status={participants[id].status}
          />
        ))
      }
    </tbody>
  </table>
)

const Group = ({ id, round, state, members }) => (
  <tr><td>{id}</td><td>{round}</td><td>{state}</td><td>{members}</td></tr>
)

const Groups = ({ groups, participants }) => (
  <table>
    <thead><tr><th>ID</th><th>Round</th><th>State</th><th>Members</th></tr></thead>
    <tbody>
      {
        Object.keys(groups).map(id => (
          <Group
            key={id}
            id={id}
            round={groups[id].round}
            state={groups[id].state}
            members={groups[id].members.length}
          />
        ))
      }
    </tbody>
  </table>
)

const mapStateToProps = ({ groups, participants, participantsNumber, groupsNumber }) => ({
  groups,
  participants,
  participantsNumber,
  groupsNumber,
})

const mapDispatchToProps = (dispatch) => {
  const open = bindActionCreators(openParticipantPage, dispatch)
  return {
    openParticipantPage: (id) => () => open(id)
  }
}

class Users extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { participants, groups, participantsNumber, groupsNumber, openParticipantPage } = this.props
    return (
      <div>
        <Card>
          <CardHeader
            title={<div>ユーザー<Badge badgeContent={participantsNumber} primary={true}><PersonIcon /></Badge></div>}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <UsersList
              participants={participants}
              openParticipantPage={openParticipantPage}
            />
          </CardText>
        </Card>
        <Card>
          <CardHeader
            title={<div>グループ<Badge badgeContent={groupsNumber} secondary={true}><PeopleIcon /></Badge></div>}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <Groups
              groups={groups}
              participants={participants}
            />
          </CardText>
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)

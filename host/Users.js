import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Badge from 'material-ui/Badge'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import PersonIcon from 'material-ui/svg-icons/social/person'
import PeopleIcon from 'material-ui/svg-icons/social/people'
import PersonOutlineIcon from 'material-ui/svg-icons/social/person-outline'

import { openParticipantPage } from './actions'

const User = ({ id, profit, grazingNum, openParticipantPage, status, group }) => (
  <tr>
    <td><a onClick={openParticipantPage(id)}>{id}</a></td>
    <td>{profit}</td>
    <td>{grazingNum}</td>
    <td>{status}</td>
    <td>{group}</td>
  </tr>
)

const UsersList = ({participants, openParticipantPage}) => (
  <table>
    <thead><tr><th>ID</th><th>Profit</th><th>Grazing</th><th>Status</th><th>Group ID</th></tr></thead>
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
            group={participants[id].group}
          />
        ))
      }
    </tbody>
  </table>
)

const Group = ({ id, state, members }) => (
  <tr><td>{id}</td><td>{state}</td><td>{members}</td></tr>
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
            state={groups[id].state}
            members={groups[id].members.length}
          />
        ))
      }
    </tbody>
  </table>
)

const mapStateToProps = ({ groups, participants, participantsNumber, groupsNumber, activeParticipantsNumber }) => ({
  groups,
  participants,
  participantsNumber,
  groupsNumber,
  activeParticipantsNumber,
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
    const { participants, groups, participantsNumber, groupsNumber, openParticipantPage, activeParticipantsNumber } = this.props
    return (
      <div>
        <Card>
          <CardHeader
            title={<div>ユーザー<Badge badgeContent={String(activeParticipantsNumber)} primary={true}><PersonIcon /></Badge> ゲーム終了待機中のユーザー<Badge badgeContent={String(participantsNumber - activeParticipantsNumber)} secondary={true}><PersonOutlineIcon /></Badge></div>}
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
            title={<div>グループ<Badge badgeContent={String(groupsNumber)} primary={true}><PeopleIcon /></Badge></div>}
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

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import throttle from 'react-throttle-render'

import Badge from 'material-ui/Badge'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import PersonIcon from 'material-ui/svg-icons/social/person'
import PeopleIcon from 'material-ui/svg-icons/social/people'
import PersonOutlineIcon from 'material-ui/svg-icons/social/person-outline'

import { openParticipantPage } from './actions'

const User = ({ id, userid, profit, grazing, openParticipantPage, status, group }) => (
  <tr>
    <td><a onClick={openParticipantPage(id)}>{userid}</a></td>
    <td>{profit}</td>
    <td>{grazing}</td>
    <td>{status}</td>
    <td>{group}</td>
  </tr>
)

const UsersList = ({page, participants, openParticipantPage}) => (
  <table className="highlight">
    <thead><tr><th>ID</th><th>Profit</th><th>Grazing</th><th>Status</th><th>Group ID</th></tr></thead>
    <tbody>
      {
        Object.keys(participants).map(id => (
          <User
            key={id}
            id={id}
            userid={participants[id].id != null ? participants[id].id : "id : " + id}
            profit={participants[id].profits.reduce((acc, val) => acc + val, 0)}
            grazing={participants[id].grazings.join(", ")}
            openParticipantPage={openParticipantPage}
            status={(participants[id].group == null) ? "Wait Matching"
              : (page != "experiment") ? (page != "description") ? page
                                                                     : participants[id].is_finish_description ? "Read" : "Reading"
                                           : (participants[id].answered ? "Answerd"
                                                                        : "Answering")}
            group={participants[id].group}
          />
        ))
      }
    </tbody>
  </table>
)

const Group = ({ id, round, status, members }) => (
  <tr><td>{id}</td><td>{round}</td><td>{status}</td><td>{members}</td></tr>
)

const Groups = ({ maxRound, groups, participants }) => (
  <table className="highlight">
    <thead><tr><th>ID</th><th>Round</th><th>Status</th><th>Members</th></tr></thead>
    <tbody>
      {
        Object.keys(groups).map(id => (
          <Group
            key={id}
            id={id}
            round={groups[id].round + 1 + " / " + maxRound}
            status={groups[id].groupStatus}
            members={groups[id].members.length}
          />
        ))
      }
    </tbody>
  </table>
)

const mapStateToProps = ({ page, maxRound, groups, participants, participantsNumber, groupsNumber, activeParticipantsNumber }) => ({
  page,
  maxRound,
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
    const { page, maxRound, participants, groups, participantsNumber, groupsNumber, openParticipantPage, activeParticipantsNumber } = this.props
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
              page={page}
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
              maxRound={maxRound}
              groups={groups}
              participants={participants}
            />
          </CardText>
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(throttle(Users, 200))

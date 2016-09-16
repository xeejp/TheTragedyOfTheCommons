import { createAction } from 'redux-act'

export const changePage = createAction('change page', page => page)
export const updateConfig = createAction('update config', config => config)
export const match = createAction('match')
export const openParticipantPage = createAction('open participant page')

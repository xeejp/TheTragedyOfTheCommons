import { createAction } from 'redux-act'

export const updateGrazing = createAction('update grazing', num => num)
export const updateSnum = createAction('update snum', snum => snum)
export const finishDescription = createAction('finish description')
export const updateConfirm = createAction('update confirm')

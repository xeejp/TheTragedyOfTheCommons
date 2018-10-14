import { fork, take, call, takeEvery } from 'redux-saga/effects'

import { fetchContents } from '../shared/actions'
import { finishDescription, updateSnum, updateGrazing, updateConfirm } from './actions'

function* fetchContentsSaga() {
  yield call(sendData, 'fetch contents')
}

function* finishDescriptionSaga() {
  yield call(sendData, 'finish description')
}

function* updateSnumSaga(action) {
  const { payload } = action
  yield call(sendData, 'update snum', payload)
}

function* updateGrazingSaga(action) {
  const { payload } = action
  yield call(sendData, 'update grazing', payload)
}

function* updateConfirmSaga(action) {
  yield call(sendData, 'update confirm')
}

function* saga() {
  yield fork(takeEvery, fetchContents.getType(), fetchContentsSaga)
  yield fork(takeEvery, finishDescription.getType(), finishDescriptionSaga)
  yield fork(takeEvery, updateSnum.getType(), updateSnumSaga)
  yield fork(takeEvery, updateGrazing.getType(), updateGrazingSaga)
  yield fork(takeEvery, updateConfirm.getType(), updateConfirmSaga)
}

export default saga

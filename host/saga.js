import { fork, take, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import { fetchContents } from 'shared/actions'
import { changePage, match, updateConfig, updateDescription } from './actions'

function* fetchContentsSaga() {
  yield call(sendData, 'fetch contents')
}

function* changePageSaga(action) {
  const { payload } = action
  yield call(sendData, 'change page', payload)
}

function* updateConfigSaga(action) {
  const { payload } = action
  yield call(sendData, 'update config', payload)
}

function* updateDescriptionSaga(action) {
  const { payload } = action
  yield call(sendData, 'update description', payload)
}

function* matchSaga() {
  yield call(sendData, 'match')
}

function* saga() {
  yield fork(takeEvery, fetchContents.getType(), fetchContentsSaga)
  yield fork(takeEvery, changePage.getType(), changePageSaga)
  yield fork(takeEvery, updateConfig.getType(), updateConfigSaga)
  yield fork(takeEvery, updateDescription.getType(), updateDescriptionSaga)
  yield fork(takeEvery, match.getType(), matchSaga)
}

export default saga

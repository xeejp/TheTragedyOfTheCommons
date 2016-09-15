import { fork, take, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import { fetchContents } from 'shared/actions'
import { finishDescription } from './actions'

function* fetchContentsSaga() {
  yield call(sendData, 'fetch contents')
}

function* finishDescriptionSaga() {
  yield call(sendData, 'finish description')
}

function* saga() {
  yield fork(takeEvery, fetchContents.getType(), fetchContentsSaga)
  yield fork(takeEvery, finishDescription.getType(), finishDescriptionSaga)
}

export default saga

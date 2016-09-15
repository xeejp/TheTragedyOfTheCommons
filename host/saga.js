import { fork, take, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import { fetchContents } from 'shared/actions'
import { changePage } from './actions'

function* fetchContentsSaga() {
  yield call(sendData, 'fetch contents')
}

function* changePageSaga(action) {
  const { payload } = action
  yield call(sendData, 'change page', payload)
}

function* saga() {
  yield fork(takeEvery, fetchContents.getType(), fetchContentsSaga)
  yield fork(takeEvery, changePage.getType(), changePageSaga)
}

export default saga

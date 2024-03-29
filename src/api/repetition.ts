import { AxiosInstance } from 'axios'

import { repData } from '../types/index'

export async function addRepetition (apiInstance : AxiosInstance, data : repData) : Promise<{repetitionId : string} | undefined> {
  apiInstance.put('/workout/add_repetition', data).then((res) => {
    if (res.status === 200) {
      return { repetitionId: res.data }
    } else {
      return undefined
    }
  }).catch(() => {
    return undefined
  })
  return undefined
}

export async function deleteRepetition (apiInstance : AxiosInstance, data : {
    workoutId : string,
    exerciseId : string,
    repetitionId : string
}) : Promise<void> {
  apiInstance.put('/workout/delete_rep', data).then((res) => {
    if (res.status === 200) {

    } else {
      Error('API call to delete rep failed')
    }
  })
}

export async function changeRepetition (apiInstance : AxiosInstance, data : repData) : Promise<void> {
  apiInstance.put('/workout/rep_change', {
    workoutId: data.workoutId,
    exerciseId: data.exerciseId,
    repItem: data.repItem
  }).then((res) => {
    if (res.status === 200) {
      console.log('changed rep to ' + JSON.stringify(data.repItem))
    } else {
      Error('API call to change rep failed')
    }
  }).catch((err) => {
    console.trace()
    console.log(err)
  })
}

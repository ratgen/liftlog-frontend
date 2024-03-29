import { Commit } from '../../../node_modules/vuex'
import { WorkoutViewState } from './state_type'
import * as user from '../../api/user'
import * as workout from '../../api/workout'
import * as repetition from '../../api/repetition'
import * as exercise from '../../api/exercise'

import { IWorkout, IExercise, IRepetition, repData } from '../../types/index'

import * as types from './mutation_types'

export const actions = {
  async login ({ commit, state } : { commit : Commit, state : WorkoutViewState}) : Promise<void> {
    /**
            Logs in with the stored credentials, and stores the JSON Web
            Token returned by the endpoint
        */

    user.validateToken(state.apiInstance).then((status : {
            validated : boolean
            payload? : string
        } | undefined) => {
      if (status !== undefined) {
        if (!status.validated) {
          user.login(state.apiInstance, {
            email: state.userData.email,
            password: state.userData.password
          }).then(() => {
            user.validateToken(state.apiInstance).then((status) => {
              if (status !== undefined) {
                if (!status.validated) {
                  Error('still not validated')
                }
              }
            })
          }).catch((err) => {
            console.trace()
            console.log(err)
          })
        }
      }
    }).catch((err) => {
      console.trace()
      console.log(err)
    })
    commit(types.SET_LOADING, true)
  },
  async getWorkout ({ commit, state } : { commit : Commit, state : WorkoutViewState}) : Promise<void> {
    /**
            Retrieve the workouts of the user, and save the response.
        */
    commit(types.SET_LOADING, true)
    workout.getWorkout(state.apiInstance).then((workouts : IWorkout[] | undefined) => {
      if (workouts !== undefined) {
        commit(types.SET_WORKOUTS, workouts)
        commit(types.SET_LOADING, false)
      }
    }).catch((err) => {
      console.trace()
      console.log(err)
      commit(types.SET_LOADING, false)
    })
  },
  async titleChange ({ commit, state } : { commit : Commit, state : WorkoutViewState}, data : {
    workoutId : string,
    title : string
  }) : Promise<void> {
    /**
            Change the title of a workout.
        */
    commit(types.SET_LOADING, true)
    workout.renameWorkout(state.apiInstance, data).then(() => {
      commit(types.CHANGE_WORKOUT_TITLE, data)
      commit(types.SET_LOADING, false)
    })
  },
  deleteWorkout ({ commit, state } : { commit : Commit, state : WorkoutViewState}, data : {
        workoutId : string
    }) : void {
    /**
            Delete one workout. First on the database, and then in the data
            stores locally.
        */
    workout.deleteWorkout(state.apiInstance, data).then(() => {
      commit(types.DELETE_WORKOUT, data)
    })
  },
  async addRepetition ({ commit, state } :
            {
                commit : Commit,
                state : WorkoutViewState
            }, data : repData) : Promise<void> {
    /**
            Add a repetition to a workout. If another repetition exists
            before it, then add the same weight and reps to the new one.

            @exerciseId - id of the exercise
            @workout Id - id of the workout
        */
    if (state.workouts !== undefined) {
      const workout: IWorkout | undefined = state.workouts.find((element : IWorkout) => element._id === data.workoutId)
      if (workout !== undefined) {
        const exercise: IExercise | undefined = (workout as IWorkout).exerciseList.find((element: IExercise) => element.id === data.exerciseId)
        if (exercise !== undefined) {
          const length = exercise.set.length
          let weight = 0
          let repetitions = 0
          if (length > 0) {
            weight = exercise.set[length - 1].weight
            repetitions = exercise.set[length - 1].repetitions
          }
          const repItem : IRepetition = {
            weight: weight,
            repetitions: repetitions
          }
          data.repItem = repItem
          repetition.addRepetition(state.apiInstance, data)
            .then((data : {repetitionId : string} | undefined) => {
              if (data !== undefined) {
                commit(types.ADD_REPETITION, data)
              }
            })
            .catch((err) => {
              console.trace()
              console.log(err)
            })
        }
      }
    }
  },
  async changeRep ({ commit, state } :
            {
                commit : Commit,
                state : WorkoutViewState
            }, data : repData) : Promise<void> {
    /**
            Change a rep of the workout. First in the local data, then in
            the database.
        */
    repetition.changeRepetition(state.apiInstance, data).then(() => {
      commit(types.CHANGE_REPETITION, data)
    })
  },
  async submitWorkout ({ commit, state } :
            {
                commit : Commit,
                state : WorkoutViewState
            }, data : IWorkout) : Promise<void> {
    /**
            Add a new workout to the user.
        */
    workout.addWorkout(state.apiInstance, data)
      .then((da : {id : string} | undefined) => {
        if (da !== undefined) {
          data._id = da.id
          commit(types.ADD_WORKOUT, data)
        }
      })
      .catch((err) => {
        console.trace()
        console.log(err)
      })
  },
  async changeExerciseName ({ commit, state } :
            {
                commit : Commit,
                state : WorkoutViewState
            }, data : {
                workoutId : string,
                exerciseId : string,
                name : string
            }) : Promise<void> {
    /**
            Change the name of an exercise.
        */
    exercise.renameExercise(state.apiInstance, data).then(() => {
      commit(types.RENAME_EXERCISE, data)
    })
  },
  async deleteExercise ({ commit, state } :
            {
                commit : Commit,
                state : WorkoutViewState
            }, data : {
                workoutId : string,
                exerciseId : string
            }) : Promise<void> {
    /*
            Delete an exercise.
        */
    exercise.deleteExercise(state.apiInstance, data).then(() => {
      commit(types.CHANGE_REPETITION, data)
    })
  },
  async deleteRep ({ commit, state } : {
                commit : Commit,
                state : WorkoutViewState
            }, data : {
                workoutId : string,
                exerciseId : string,
                repetitionId : string
    }) : Promise<void> {
    repetition.deleteRepetition(state.apiInstance, data).then(() => {
      commit(types.DELETE_REPETITION, data)
    })
  },
  setWorkingOut ({ commit } : {
        commit : Commit,
        state : WorkoutViewState
    }, bool : boolean) : void {
    commit(types.SET_WORKINGOUT, bool)
  },
  setCurrentWorkout ({ commit } : {
        commit : Commit
    }, workout : IWorkout) : void {
    commit(types.SET_CURRENTWORKOUT, workout)
  }

}

export default actions

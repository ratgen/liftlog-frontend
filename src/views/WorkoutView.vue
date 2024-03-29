<template>
  <div v-if="!workingOut">
    <HelloHeader class="hello-header"/>
    <div class="todo-block">
      <div class="todo">
        <div v-bind:key="workout" v-for="(workout) in workouts" >
          <Workout
              :workout="workout"
              />
        </div>
          <AddWorkout/>
      </div>
    </div>
    <BeginWorkout
        :workouts="workouts"
        @select-workout="selectedWorkout"
        @continue-workout="continueWorkout"
        />
  </div>
  <WorkoutProcess v-else
    :workoutData="currentWorkout"
    v-on:back="workingOut = false"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from '../../node_modules/vuex'

import { IWorkout } from '../types/index'

import AddWorkout from '../components/AddWorkout.vue'
import HelloHeader from '../components/HelloHeader.vue'
import Workout from '../components/Workout.vue'
import BeginWorkout from '../components/BeginWorkout.vue'
import WorkoutProcess from '../views/WorkoutProcess.vue'

export default defineComponent({
  /**
        View of the workouts.
   */
  name: 'WorkoutView',
  components: {
    Workout,
    HelloHeader,
    AddWorkout,
    BeginWorkout,
    WorkoutProcess
  },
  computed: {
    ...mapState('workoutView', ['workouts', 'workingOut', 'name', 'currentWorkout'])
  },
  methods: {
    ...mapActions('workoutView', [
      'login',
      'getWorkout',
      'setWorkingOut',
      'setCurrentWorkout'
    ]),
    selectedWorkout (workout : IWorkout) {
      this.setWorkingOut(true)
      this.setCurrentWorkout(workout)
    },
    continueWorkout () {
      this.setCurrentWorkout({})
      this.setWorkingOut(true)
    }
  },
  mounted () {
    /**
            Receiving emitted events
     */
    this.login().then(() => {
      this.getWorkout()
    })
  }
})
</script>

<style lang="scss" >
@import "../assets/variables.scss";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}
.btn {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
}
.btn:hover {
  background: #666;
}
.addtodo {
  padding-top: 25px;
}

.todo {
  padding-top: 0.3rem;

}
.todo-block {
  width: $content-width;
  margin: 0 auto;
}

.hello-header {
  width: calc(#{$content-width} - 2%);
  margin: 0 auto;
}

@media only screen and (max-width: 1400px) {
  .todo-block {
    width: 60%;
  }
  .hello-header {
    width: 60%;
  }
}

@media only screen and (max-width: 1000px) {
  .todo-block {
    width: 80%;
  }
  .hello-header {
    width: 80%;
  }
  .start-workout {
    width: 40%;
    left: calc((100% - 40%) / 2);
  }
}

@media only screen and (max-width: 600px) {
  .todo-block {
    width: 100%;
  }
  .hello-header {
    width: 95%;
  }
  .start-workout {
    width: 90%;
    left: 5%;
  }
}

</style>

<template>
  <div class="task" draggable="true" @dragstart="dragstart" @click.stop="goToTaskDetails" @deleteTask="deleteTask">
    <svg-icon type="mdi" :path="deleteNew" @click.stop="deleteTask" class="delete-icon"></svg-icon>
    <div>{{ task.title }}</div>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiTrashCanOutline } from '@mdi/js';
export default {
  props: {
    task: {
      type: Object,
      required: true,
    }
  },
  components: {
    SvgIcon
  },
  data() {
    return {
      deleteNew: mdiTrashCanOutline,
    }
  },
  methods: {
    dragstart() {
      this.$emit('dragstart');
    },
    goToTaskDetails() {
        this.$emit('openTaskDescription', {
        taskId: this.task.id
      });
    },
    deleteTask() {
      this.$emit('deleteTask');
    },
  },
};
</script>

<style scoped lang="css">


.task {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #656565;
  border-radius: 0.25rem;
  cursor: pointer;
  position: relative;
}


button {
  margin-top: 0.25rem;
}
</style>

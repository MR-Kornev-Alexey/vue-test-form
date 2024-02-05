<template>
  <div class="block-in-center text-[#6b6b6b] " style="flex-direction: column">
    <form @submit.prevent="addColumn" data-testid="add-items" class="grid grid-cols-1 md:grid-cols-2 gap-1">
      <div>
        <input type="text" v-model="newColumn" class="input-common" placeholder="Новая стадия"/>
      </div>
      <div>
        <button class="btn-common w-full md:w-auto">Добавить стадию</button>
      </div>
    </form>
    <div class="kanban-main">
    <div class="kanban-board">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-8 sm:p-0 gap-8 sm:gap-16 my-4 sm:my-12 ">
        <div v-for="(column, index) in columns" :key="index" class="kanban-column">
          <svg-icon type="mdi" :path="deleteNew" @click.stop="removeColumn(index)" class="delete-icon"></svg-icon>
          <div v-if="column.editMode" class="cursor-pointer" @click="enableEditMode(column)">
            <h2> {{ column.title }}</h2>
          </div>
          <div v-else>
            <input v-model="column.title" @blur="disableEditMode(column.title,column.id)"
                   @keyup.enter="disableEditMode(column.title,column.id)"
                   class="input-common percent100">
          </div>
          <div @drop="dropTask(index)" @dragover.prevent class="kanban-column-tasks mt-3">
            <Task v-for="(task, taskIndex) in column.tasks" :key="taskIndex" :task="task" :phaseIndex="index"
                  :taskIndex="taskIndex"
                  @dragstart="dragstart(task, index, taskIndex)" @deleteTask="deleteTask(index, taskIndex)"
                  @openTaskDescription="handleOpenTaskDescription">
            </Task>
          </div>
          <form @submit.prevent="addTask(index)" data-testid="add-task" class="add-new-task">
            <input type="text" v-model="newTask[index]" class="input-common percent100"/>
            <svg-icon type="mdi" :path="addTaskIndividual" @click.stop="addTask(index)" class="ml-1 cursor-pointer"
                      :size="30"></svg-icon>
          </form>
        </div>
      </div>
    </div>
    </div>
    <ExtraModal :visible="showModalMax" :idOpenTaskModal="parentOpenTaskModal" ref="childComponentRef" :updateHeight="windowHeight" />
  </div>
</template>

<script>
import {ref} from 'vue';
import {useKanbanStore} from '../../stores/kanban'
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiTabPlus, mdiTrashCanOutline} from '@mdi/js';

import Task from '../task';
import ExtraModal from "../extraModal";
import {v4 as uuidv4} from 'uuid';

export default {
  components: {
    Task,
    SvgIcon,
    ExtraModal
  },
  data() {
    return {
      deleteNew: mdiTrashCanOutline,
      addTaskIndividual: mdiTabPlus,
      showModalMax: false,
      parentOpenTaskModal: '',
      allYourTask: '',
      windowWidth: 0,
      windowHeight: 200
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateWidth)
    window.addEventListener('resize', this.updateHeight)
    this.updateWidth()
    this.updateHeight()
  },
  methods: {
    updateWidth () {
      this.windowWidth = window.innerWidth
    },
    updateHeight () {
      this.windowHeight = window.innerHeight*0.7
    },
    handleOpenTaskDescription(data) {
      // this.parentOpenTaskModal = data.taskId
      this.showModalMax = !this.showModalMax;
      this.$refs.childComponentRef.handleOpenTaskDescription(data.taskId);
      // this.findOpenTask(data.taskId);
    },
    findOpenTask(id) {
      const yourTask = this.firstItem.reduce((result, column) => {
        const task = column.tasks.find(task => task.id === id);
        return task ? task : result;
      }, null);
      if (yourTask) {
        console.log("Найдена задача:", yourTask);
        this.parentOpenTaskModal =  yourTask
      } else {
        console.log("Задача с указанным id не найдена.");
        this.parentOpenTaskModal = ''
      }
    },
  },
  setup() {
    const kanbanStore = useKanbanStore();
    const columns = kanbanStore.columns;
    const newColumn = ref('');
    const newTask = ref(['', '', '', '']);

    const addColumn = () => {
      if (newColumn.value) {
        kanbanStore.addColumn(newColumn.value);
        newColumn.value = '';
      }
    };
    const firstItem = kanbanStore.getFirstItem;

    const findOnoTask = (taskId) => {
      kanbanStore.findOpenTask(taskId)
    };

    const enableEditMode = (columnIndex) => {
      kanbanStore.changeTitleColumn(columnIndex.id);
    };

    const disableEditMode = (title, id) => {
      if (title) {
        kanbanStore.inputNewTitleColumn(title, id);
      }
    };

    const removeColumn = (index) => {
      kanbanStore.removeColumn(index);
    };

    const addTask = (columnIndex) => {
      if (newTask.value[columnIndex]) {
        const uniqueTack = {
          id: uuidv4(),
          title: newTask.value[columnIndex],
          description: "введите новую задачу",
          linkTask: '#'
        }
        kanbanStore.addTask(columnIndex, uniqueTack);
        newTask.value = ['', '', '', ''];
      }
    };

    const dragstart = (task, columnIndex, taskIndex) => {
      kanbanStore.setDraggedTask({task, columnIndex, taskIndex});
    };

    const dropTask = (columnIndex) => {
      kanbanStore.dropTask(columnIndex);
    };

    const deleteTask = (columnIndex, taskIndex) => {
      kanbanStore.deleteTask(columnIndex, taskIndex);
    };

    return {
      columns,
      newColumn,
      newTask,
      firstItem,
      addColumn,
      removeColumn,
      addTask,
      dragstart,
      dropTask,
      deleteTask,
      enableEditMode,
      disableEditMode,
      findOnoTask
    };
  },
};
</script>

<style scoped lang="css">

.kanban-main {
  display: flex;
  justify-content: center;
  align-items: center;
}

.kanban-board {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.kanban-column {
  padding: 1rem;
  border: 1px solid #494949;
  border-radius: 0.5rem;
  width: 250px;
  position: relative;
  margin: 0 auto;
}

.kanban-column h2 {
  margin-bottom: 1rem;
}

.kanban-column-tasks {
  min-height: 100px;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

input {
  margin-bottom: 0.5rem;
}
@media screen and (max-width: 1024px) {
  .kanban-column {
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #494949;
    border-radius: 0.5rem;
    width: 220px;
    position: relative;
  }
}
@media screen and (max-width: 912px) {
  .kanban-column {
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #494949;
    border-radius: 0.5rem;
    width: 260px;
    position: relative;
  }
}
@media screen and (max-width: 600px) {
  .kanban-column {
    margin: 1rem;
    padding: 0.6rem;
    border: 1px solid #494949;
    border-radius: 0.5rem;
    width: 90%;
    position: relative;
  }
}

</style>

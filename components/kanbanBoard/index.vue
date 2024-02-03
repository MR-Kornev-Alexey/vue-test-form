<!-- Компонент для канбан доски (components/KanbanBoard.vue) -->
<template>
  <div class="kanban-board">
    <div v-for="(column, index) in columns" :key="index" class="kanban-column">
      <h2>{{ column.title }}</h2>
      <button @click="removeColumn(index)">Удалить стадию</button>
      <div @drop="dropTask(index)" @dragover.prevent class="kanban-column-tasks">
        <Task v-for="(task, taskIndex) in column.tasks" :key="taskIndex" :task="task"
              @dragstart="dragstart(task, index, taskIndex)" @deleteTask="deleteTask(index, taskIndex)">
        </Task>
      </div>
      <input v-model="newTask" @keyup.enter="addTask(index)" placeholder="Добавить задачу">
    </div>
    <div>
      <input v-model="newColumn" @keyup.enter="addColumn" placeholder="Добавить стадию">
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
// import { useKanbanStore } from '~/stores/kanbanStore'; // Ваш Store с Pinia
import { useUserStore } from '../../stores/user'
import { useCartStore } from '../../stores/cart'

import Task from '~/components/Task.vue';

export default {
  components: {
    Task,
  },
  setup() {
    const kanbanStore = useKanbanStore();
    const columns = kanbanStore.columns;
    const newColumn = ref('');
    const newTask = ref('');
    const user = useUserStore()
    const cart = useCartStore()
    const itemName = ref('')

    const addColumn = () => {
      if (newColumn.trim() !== '') {
        kanbanStore.addColumn(newColumn.trim());
        newColumn.value = '';
      }
    };

    const removeColumn = (index) => {
      kanbanStore.removeColumn(index);
    };

    const addTask = (columnIndex) => {
      if (newTask.trim() !== '') {
        kanbanStore.addTask(columnIndex, newTask.trim());
        newTask.value = '';
      }
    };

    const dragstart = (task, columnIndex, taskIndex) => {
      kanbanStore.setDraggedTask({ task, columnIndex, taskIndex });
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
      user,
      cart,
      itemName,
      addColumn,
      removeColumn,
      addTask,
      dragstart,
      dropTask,
      deleteTask,
    };
  },
};
</script>

<style scoped lang="css">
@import "@/styles/tailwind.css";

.kanban-board {
  display: flex;
}

.kanban-column {
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  width: 250px;
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
</style>

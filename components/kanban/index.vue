<template>
  <section class="flex p-6 sm:p-20 mx-auto container">
    <!-- Узкое меню слева -->
    <div class="flex-none w-12">
      <!-- Иконка и кнопка "Добавить колонку" -->
      <div class="mb-4">
        <button @click="addColumn">
          <!-- Иконка для "Добавить колонку" (замените на свою иконку) -->
          <svg-icon type="mdi" :path="path" size={1} ></svg-icon>
        </button>
      </div>
      <!-- Иконка и кнопка "Добавить задачу" -->
      <div>
        <button @click="addTask">
          <!-- Иконка для "Добавить задачу" (замените на свою иконку) -->
          <svg-icon type="mdi" :path="shapeSquare" size={1} ></svg-icon>
        </button>
      </div>
    </div>
    <!-- Основной контент (ваша сетка колонок) -->
    <div class="flex-1">
      <div class="text-center space-y-3 relative">
        <h2 class="text-[#14183E] font-bold text-4xl sm:text-5xl font-volkhov uppercase">Kanban</h2>
        <p>--------------</p>
        <KanbanBoard />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-8 sm:p-0 gap-8 sm:gap-16 my-4 sm:my-12 text-center">
        <div class="stages-main" v-for="(column, index) in columns" :key="index">
          <div class="stages-main-title">
            <p class="text-[#1E1D4C] font-semibold mb-3">{{ column.title }}</p>
          </div>
          <div class="stages-main-cards">
            <!-- Здесь будет содержимое вашей колонки -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {ref} from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiTableColumnPlusAfter, mdiShapeSquarePlus } from '@mdi/js';
import KanbanBoard from "../kanbanBoard";
// import { useKanbanStore } from '~/stores/kanbanStore'; // Ваш Store с Pinia

// import Task from '~/components/Task.vue';

export default {
  components: {
    SvgIcon,
    KanbanBoard
  },
  data() {
    return {
      path: mdiTableColumnPlusAfter,
      shapeSquare: mdiShapeSquarePlus
    }
  },
  setup() {
    // const kanbanStore = useKanbanStore();
    // const columns = kanbanStore.columns;
    const columns = [
      {
        title: "Задача1",
        number: 1
      },
      {
        title: "Задача 2",
        number: 1
      },
      {
        title: "Задача 3",
        number: 1
      },
      {
        title: "Задача 4",
        number: 1
      }
    ]

    return {
      columns
    };
  },
};
</script>


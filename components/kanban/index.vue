<template>
  <section class="flex p-6 sm:p-20 mx-auto container">
    <div class="flex-col">
      <div class="text-center space-y-3 relative">
        <h2 class="text-[#6b6b6b] font-bold text-4xl sm:text-5xl font-volkhov uppercase">Kanban</h2>
        <KanbanBoard />
      </div>
    </div>
  </section>
</template>

<script>

import KanbanBoard from "../kanbanBoard";

export default {
  components: {
    KanbanBoard
  }
};
</script>


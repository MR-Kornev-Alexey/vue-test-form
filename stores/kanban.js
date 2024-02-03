import {defineStore, acceptHMRUpdate} from 'pinia';

export const useKanbanStore = defineStore({
    id: 'kanbanBoard',
    state: () => ({
        columns: [
            {id: 0, title: 'To Do', tasks: [], editMode: true},
            {id: 1, title: 'In Progress', tasks: [], editMode: true},
            {id: 2, title: 'Testing', tasks: [], editMode: true},
            {id: 3, title: 'Done', tasks: [], editMode: true},
        ],
        draggedTask: null,
    }),
    getters: {
        getFirstItem: state => {
            return state.columns;
        }
    },
    actions: {
        changeTitleColumn (id) {
            const foundColumn = this.columns.find(column => column.id === id);
            foundColumn.editMode = false
        },
        inputNewTitleColumn (title, id){
            const foundColumn = this.columns.find(column => column.id === id);
            foundColumn.editMode = true
            foundColumn.title = title
        },
        addColumn(title) {
            const id = this.columns.length
            this.columns.push({ id: id,  title, tasks: [], editMode: true});
        },
        removeColumn(index) {
            this.columns.splice(index, 1);
        },
        // addTaskOld(columnIndex, text) {
        //     this.columns[columnIndex].tasks.push({text});
        // },
        deleteTask(columnIndex, taskIndex) {

            this.columns[columnIndex].tasks.splice(taskIndex, 1);
        },
        // Добавление новой задачи в колонку
        addTask(columnId, task) {
            this.columns[columnId].tasks.push(task);
        },
        // Удаление задачи из колонки
        removeTask(columnId, taskId) {
            this.columns[columnId].tasks = this.columns[columnId].tasks.filter(task => task.id !== taskId);
        },
        // Обновление информации о задаче
        findOpenTask(id) {
            const yourTask =this.columns.reduce((result, column) => {
                const task = column.tasks.find(task => task.id === id);
                return task ? task : result;
            }, null);

            if (yourTask) {
                console.log("Найдена задача:", yourTask);
                return Promise.resolve(yourTask)
            } else {
                console.log("Задача с указанным id не найдена.");
                return Promise.resolve('')
            }
        },
        updateTask(columnId, taskId, updatedTask) {
            const columnIndex = this.columns.findIndex(column => column.id === columnId);
            const taskIndex = this.columns[columnIndex].tasks.findIndex(task => task.id === taskId);

            if (columnIndex !== -1 && taskIndex !== -1) {
                this.$set(this.columns[columnIndex].tasks, taskIndex, updatedTask);
            }
        },
        setDraggedTask(draggedTask) {
            this.draggedTask = draggedTask;
        },
        dropTask(targetColumnIndex) {
            if (this.draggedTask) {
                const {task, columnIndex, taskIndex} = this.draggedTask;
                this.columns[targetColumnIndex].tasks.push(task);
                this.columns[columnIndex].tasks.splice(taskIndex, 1);
                this.draggedTask = null;
            }
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useKanbanStore, import.meta.hot));
}

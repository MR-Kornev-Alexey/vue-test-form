<template>
  <div class="v-pop-collection">
    <div
        :aria-hidden="modalToggle"
        :class="{'extra-modal-hidden': !active, 'extra-modal-visible': active}"
        @keydown.esc="active = false"
        class="extra-modal"
        role="dialog"
        tabindex="-1"
    >
      <transition name="scale">
        <div class="extra-modal-container" v-if="active">
           <div class="extra-modal-inner" ref="scrollContainer" :style="{ height: updateHeight + 'px', overflowY: 'auto' }"  >
            <div class="extra-modal-header">
              <div>
                <div v-if="editMode" class="cursor-pointer" @click="enableEditMode">
                  <h2> {{ dataFromStore.title }}</h2>
                </div>
                <div v-else>
                  <input v-model="titleTask" @blur="updateTitleOneTask(dataFromStore.id, titleTask)"
                         @keyup.enter="updateTitleOneTask(dataFromStore.id, titleTask)"
                         class="input-common percent100">
                </div>
              </div>
              <svg-icon type="mdi" :path="close" class="delete-icon" color="black" size="32px"
                        @click="modalToggle"></svg-icon>
            </div>
            <div class="extra-modal-content text-center">
              <div v-if="editDescription" class="cursor-pointer" @click="enableEditDescription">
                <p class="text-left pl-3" v-html="formatText(dataFromStore.description)"></p>
              </div>
              <div v-else class="box-input">
                <textarea v-model="descriptionTask" placeholder="add multiple lines" class="input-form"
                          @blur="updateDescriptionOneTask(dataFromStore.id, descriptionTask)"

                ></textarea>
                <button class="btn-common mt-2" @click.stop="updateDescriptionOneTask(dataFromStore.id, descriptionTask)">Сохранить</button>
              </div>

              <div class="block-in-center my-2 ">
                <svg-icon type="mdi" :path="linkEdit" color="black" size="32px" class="mr-1 cursor-pointer" @click="enableEditLink"></svg-icon>
                <div v-if="editLink" class="cursor-pointer" >

                  <a :href="dataFromStore.linkTask" target="_blank" class="a-clean">
                    Перейти на страницу <span class="font-bold">{{ dataFromStore.linkTask }}</span></a>
                </div>
                <div v-else>
                  <input v-model="newLinkTask" @blur="updateLinkOneTask(dataFromStore.id, newLinkTask)"
                         @keyup.enter="updateLinkOneTask(dataFromStore.id, newLinkTask)"
                         class="input-common percent100">
                </div>

              </div>

            </div>
          </div>
        </div>
      </transition>

      <div @click="modalToggle" class="extra-modal-bg">

      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import {mdiWindowClose, mdiLinkBoxVariantOutline, mdiLinkEdit} from '@mdi/js'
import {useKanbanStore} from '../../stores/kanban'
import {ref} from "vue";

export default {
  name: "extraModal",
  setup() {
    const kanbanStore = useKanbanStore();
    const dataFromStore = ref('');
    const titleTask = ref('введите заголовок задачи');
    const descriptionTask = ref('введите текст задачи');
    const newLinkTask = ref('введите ссылку');
    let editMode = ref(true)
    let editDescription = ref(true)
    let editLink = ref(true)
    const handleOpenTaskDescription = async (taskId) => {
      try {
        const foundTask = await kanbanStore.findOpenTask(taskId);
        dataFromStore.value = foundTask;
        console.log('Найдена задача modal:', foundTask);
        // Далее обрабатывайте найденную задачу
      } catch (error) {
        console.error('Ошибка при поиске задачи:', error);
      }
    };
    const updateTitleOneTask = async (taskId, newTitle) => {
      try {
        await kanbanStore.updateTitleTask(taskId, newTitle.trim());
        editMode.value = true
      } catch (error) {
        console.error('Ошибка при записи задачи:', error);
      }
    }
    const updateDescriptionOneTask = async (taskId, newDescription) => {
      try {
        await kanbanStore.updateDescriptionTask(taskId, newDescription);
        editDescription.value = true
      } catch (error) {
        console.error('Ошибка при записи задачи:', error);
      }
    }
    const updateLinkOneTask = async (taskId, newLink) => {
      try {
        await kanbanStore.updateLinkTask(taskId, newLink);
        editLink.value = true
      } catch (error) {
        console.error('Ошибка при записи задачи:', error);
      }
    }
    return {
      handleOpenTaskDescription,
      updateTitleOneTask,
      updateDescriptionOneTask,
      updateLinkOneTask,
      dataFromStore,
      titleTask,
      descriptionTask,
      newLinkTask,
      editMode,
      editDescription,
      editLink
    };
  },
  components: {
    SvgIcon
  },
  props: {
    visible: {
      default: false
    },
    idOpenTaskModal: {
      type: String,
      default: "задача"
    },
    updateHeight: {
      default: 200
    }
  },
  data: function () {
    return {
      active: false,
      close: mdiWindowClose,
      link: mdiLinkBoxVariantOutline,
      linkEdit: mdiLinkEdit,
      message: "введите текст задачи",
      containerHeight: 300
    };
  },
  methods: {
    modalToggle() {
      this.active = !this.active;
      this.editDescription = true
      this.editMode = true
    },
    enableEditMode() {
      this.titleTask = this.dataFromStore.title
      this.editMode = false
    },
    enableEditDescription() {
      this.descriptionTask = this.dataFromStore.description
      this.editDescription = false
    },
    enableEditLink(){
      this.editLink = false
      this.newLinkTask = this.dataFromStore.linkTask
    },
    formatText(text) {
      // Замените символы новой строки на <br> и сохраните отступы
      return text.replace(/\n/g, '<br>&nbsp;');
    }
  },
  watch: {
    visible(oldVal, newVal) {
      this.active = !this.active;
    }
  }
};
</script>


<style scoped lang="css">
.input-form {
  width: 90%;
  border: 1px solid #333333;
}

.extra-modal {
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.8);
  text-align: left;
}

.extra-modal-container {
  background-color: transparent;
  width: 90%;
  min-height: 60px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999999;
  border-radius: 0.5rem;
}

.extra-modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  text-transform: uppercase;
  font-size: 22px;
}

.extra-modal-inner {
  background-color: whitesmoke;
  border-radius: 0.5rem;
  min-height: 100px;
  padding: 8px;
}

.extra-modal-content {
  font-size: 18px;
  color: #333;
}

.extra-modal-bg {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  z-index: 999;
  background: rgba(0, 0, 0, 0.7);
}

.extra-modal-hidden {
  display: none;
}

.extra-modal-visible {
  display: block;
}

@keyframes bounce-in {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>

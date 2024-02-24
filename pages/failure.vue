<template>
  <section class="flex flex-col justify-center items-center p-6 sm: text-center  mx-auto container">
    <h2 class="text-[#6b6b6b] font-bold text-4xl sm:text-3xl font-volkhov uppercase">Ошибка ввода</h2>
    <div class="text-[#6b6b6b] text-2sm font-volkhov mt-3" @click="$router('/')">Ваши данные не сохранились, повторите ввод </div>
    <div class="flex flex-col justify-center p-6">
      <button class="p-4 cursor-pointer border-solid border-2 border-[#6b6b6b]  uppercase hover:bg-red text-[#6b6b6b]  font-bold py-2 px-4  inline-flex items-center" @click="redirectToHome">
        <svg-icon type="mdi" :path="path" ></svg-icon>
             назад
      </button>
    </div>
  </section>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js';
import SvgIcon from "@jamescoyle/vue-icon";
export default {
  name: "failure",
  components: {
    SvgIcon
  },
  data() {
    return{
      path: mdiArrowLeft,
    }
  },
  methods: {
    redirectToHome() {
      // Используйте $router.push для перехода на главную страницу
      this.$router.push('/');
    }
}
}
</script>

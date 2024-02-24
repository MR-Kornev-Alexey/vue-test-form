<template>
  <section class="flex flex-col justify-center items-center mx-auto p-6 container">
      <h2 class="text-[#6b6b6b] font-bold text-4xl sm:text-3xl font-volkhov uppercase">Форма заказа</h2>
    <Form @submit="handleRegister" :validation-schema="schema" class="flex flex-col justify-center items-center p-6 ">
        <div class="flex flex-col justify-center p-6">
          <label for="name" class="p-2">Введите ваше имя</label>
          <Field name="name" type="text" id="name" class="border-solid border-2 border-gray-600 p-1"/>
          <ErrorMessage name="name" class="text-[red] text-xs mt-1"/>
        </div>
      <div class="flex flex-col justify-center p-6">
          <label for="phone">Ведите номер телефона</label>
          <Field name="phone" type="phone" id="phone"
                 v-model="phoneNumber"
                 @keypress="allowOnlyNumbersAndPlus"
                 pattern="^\+?[0-9]+$"
                 @blur="validatePhoneNumber"
                 @keyup.enter="validatePhoneNumber"
                 class="border-solid border-2 border-gray-600 p-1"/>
        </div>
      <div class="text-[red] text-xs mt-1">{{errorPhone}}</div>
      <div>
         <input type="hidden" name="hiddenField" v-model="hiddenField">
      </div>
      <div class="flex flex-col justify-center p-6">
          <button class="p-4 cursor-pointer border-solid border-2 border-[#6b6b6b]  uppercase hover:bg-red text-[#6b6b6b]  font-bold py-2 px-4  inline-flex items-center" :disabled="loading">
            <svg-icon v-show="loading" type="mdi" :path="path" ></svg-icon>
           Заказать
          </button>
        </div>
    </Form>
  </section>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLock } from '@mdi/js';
import axios from 'axios';
export default {
  name: 'input-form',
  components: {
    Form,
    Field,
    ErrorMessage,
    SvgIcon
  },
  data() {
    const schema = yup.object().shape({
      name: yup
          .string()
          .required('Ввод имени обязателен')
          .min(2, 'минимальное количество 2 знака')
          .matches(/^[\p{L}\s\-]+$/u, 'Имя может содержать только буквы, пробелы и тире')
          .trim()
    })
    return {
      phoneNumber: '',
      name: '',
      hiddenField: 'test',
      errorPhone: '',
      path: mdiLock,
      loading: false,
      schema,
    };
  },
  methods: {
    validatePhoneNumber() {
      // Здесь  проверка номера телефона
      const phoneRegExp = /^(?:(?:\+|00)([1-9]\d{0,2})\s*)?(?:(?:\(0?\d{1,4}\)|0)\s*)?[1-9][0-9]{2,3}(?:[\s-]*[0-9]{2,4}){2}$/;

      // Проверка длины и начального символа номера телефона
      if ((this.phoneNumber.startsWith('+7') && this.phoneNumber.length !== 12) ||
          (this.phoneNumber.startsWith('8') && this.phoneNumber.length !== 11)) {
        this.errorPhone = "Проверьте корректность номера телефона, он может начинаться с '+7' или с '8' и далее 10 знаков.";
        return;
      }

      if (phoneRegExp.test(this.phoneNumber)) {
        if (this.phoneNumber.startsWith('+7') && this.phoneNumber.length === 12) {
          this.phoneNumber = this.phoneNumber.replace(/^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1 ($2)-$3-$4-$5');
        } else if (this.phoneNumber.startsWith('8') && this.phoneNumber.length === 11) {
          this.phoneNumber = this.phoneNumber.replace(/^(8)(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($2)-$3-$4-$5');
        }
      } else {
        this.errorPhone = "Проверьте корректность номера телефона, он должен начинаться с '+7' или с '8' и далее 10 знаков.";
      }
    },
    allowOnlyNumbersAndPlus(event) {
      const charCode = event.charCode;
      if (charCode !== 43 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    },
    handleRegister () {
      this.loading = true
      axios.post('https://order.drcash.sh/v1/order', {
        stream_code: 'iu244',
        client: {
          name: this.name,
          phone: this.phoneNumber
        },
        sub1: this.hiddenField
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer NWJLZGEWOWETNTGZMS00MZK4LWFIZJUTNJVMOTG0NJQXOTI3'
        }
      })
          .then(response => {
            this.$router.push('/success');
            console.log(response.data);
          })
          .catch(error => {
            this.$router.push('/failure');
            console.error('Ошибка при отправке запроса:', error);
          });
    }
  }
};
</script>

<style scoped >

</style>


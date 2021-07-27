<template>
  <div class="login">
    <el-form ref="loginForm" :model="form" :rules="rules">
      <el-form-item prop="username">
        <el-input ref="accountInput" v-model="form.username" placeholder="Username" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          ref="passwordInput"
          placeholder="Password"
          v-model="form.password"
          show-password
          @keyup.enter="login"
        />
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="login">Login</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, watch, onMounted } from 'vue'
import { useStore } from '@/store'
import { useRouter, useRoute } from '@/router'
import { LocationQueryValue } from 'vue-router'

interface State {
  form: {
    username: string
    password: string
  }
  redirect: LocationQueryValue
  otherQuery: { [key: string]: any }
}

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const validateUsername = (_rule, value, callback) => {
      if (!['admin', 'editor'].includes(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (_rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('The password can not be less than 5 digits'))
      } else {
        callback()
      }
    }
    const rules = {
      username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      password: [{ required: true, trigger: 'blur', validator: validatePassword }],
    }

    const loginForm = ref()
    const accountInput = ref()
    const passwordInput = ref()

    const state = reactive<State>({
      form: {
        username: 'admin',
        password: '11111',
      },
      redirect: null,
      otherQuery: {},
    })

    function login() {
      const { username, password } = state.form

      loginForm.value.validate((valid) => {
        if (!valid) return false

        store
          .dispatch('user/login', {
            username,
            password,
          })
          .then(() => {
            router.push({ path: state.redirect || '/', query: state.otherQuery })
          })
      })
    }

    function getOtherQuery(query) {
      return Object.keys(query).reduce((res, pre) => {
        if (pre !== 'redirect') {
          res[pre] = query[pre]
        }
        return res
      }, {})
    }

    watch(
      () => route,
      (route) => {
        const query = route.query
        if (query) {
          state.redirect = query.redirect as string
          state.otherQuery = getOtherQuery(query)
        }
      },
      {
        immediate: true,
      }
    )

    onMounted(() => {
      if (state.form.username === '') {
        accountInput.value.focus()
      } else if (state.form.password === '') {
        passwordInput.value.focus()
      }
    })

    return {
      rules,
      loginForm,
      accountInput,
      passwordInput,
      ...toRefs(state),
      login,
      getOtherQuery,
    }
  },
})
</script>

<style scoped lang="scss">
.login {
  color: red;
}
</style>

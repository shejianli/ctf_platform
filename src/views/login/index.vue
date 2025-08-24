
<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-title">Login Arco Admin</div>

      <a-form
        ref="loginForm"
        :model="userInfo"
        layout="vertical"
        @submit="handleSubmit"
      >
        <a-form-item
          field="username"
          :rules="[{ required: true, message: '用户名不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input v-model="userInfo.username" placeholder="用户名：admin" @keyup.enter="handleSubmit">
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          field="password"
          :rules="[{ required: true, message: '密码不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input v-model="userInfo.password" placeholder="密码：admin" type="password" @keyup.enter="handleSubmit">
            <template #prefix>
              <icon-lock />
            </template>
          </a-input>
        </a-form-item>

        <a-space :size="16" direction="vertical">
          <div class="login-form-password-actions">
            <a-checkbox checked="rememberPassword" @change="setRememberPassword">
              记住密码
            </a-checkbox>
            <a-link>忘记密码？</a-link>
          </div>
          <a-button type="primary" html-type="submit" long :loading="loading">
            登录
          </a-button>
          <a-button type="text" long class="login-form-register-btn">
            注册账号
          </a-button>
        </a-space>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import useLoading from '@/hooks/loading'
import { setToken } from '@/utils/auth'

const userInfo = reactive({
  username: 'admin',
  password: 'admin',
})
const { loading, setLoading } = useLoading()

const store = useStore()
const router = useRouter()

const handleSubmit = async () => {
  setLoading(true)
  
  // 模拟登录延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 直接写入登录状态
  const loginData = {
    token: 'mock-token-' + Date.now(),
    userInfo: {
      id: 1,
      username: userInfo.username,
      avatar: '',
      email: userInfo.username + '@example.com',
      role: 'admin'
    }
  }
  
  // 存储到Cookies（与auth工具函数保持一致）
  setToken(loginData.token)
  
  // 更新store状态
  store.commit('user/SET_TOKEN', loginData.token)
  store.commit('user/SET_USER_INFO', loginData.userInfo)
  
  setLoading(false)
  
  // 跳转到练习页面
  await router.push({ name: 'practice' })
}
</script>

<style scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center
}

.login-form {
  width: 352px;
  padding: 16px;
  background: white;
}

.login-form-title {
  color: var(--color-text-1);
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 16px;
  text-align: center;
}

.login-form-password-actions {
  display: flex;
  justify-content: space-between;
}

.login-form-register-btn {
  color: var(--color-text-3) !important;
}
</style>

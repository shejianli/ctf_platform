
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
          <a-input v-model="userInfo.username" placeholder="用户名：admin">
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
          <a-input v-model="userInfo.password" placeholder="密码：admin" type="password">
            <template #prefix>
              <icon-lock />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          field="captcha"
          :rules="[{ required: true, message: '验证码不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <div class="captcha-container">
            <a-input 
              v-model="userInfo.captcha" 
              placeholder="请输入验证码" 
              class="captcha-input"
            >
              <template #prefix>
                <icon-safe />
              </template>
            </a-input>
            <div class="captcha-image" @click="refreshCaptcha" title="点击刷新验证码">
              <img v-if="captchaData.picPath" :src="captchaData.picPath" alt="验证码" />
              <div v-else class="captcha-placeholder">点击获取验证码</div>
            </div>
          </div>
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
import { reactive, ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import { setToken } from '@/utils/auth'
import { login, getCaptcha } from '@/api/user'

const userInfo = reactive({
  username: 'admin',
  password: 'admin',
  captcha: '',
  captchaId: ''
})

const captchaData = ref({
  captchaId: '',
  picPath: '',
  captchaLength: 4,
  openCaptcha: true
})

const { loading, setLoading } = useLoading()

const store = useStore()
const router = useRouter()

// 获取验证码
const refreshCaptcha = async () => {
  try {
    const response = await getCaptcha()
    console.log('验证码响应:', response.data) // 调试日志
    if (response.data.code === 0) {
      captchaData.value = response.data.data
      userInfo.captchaId = response.data.data.captchaId
      console.log('验证码获取成功:', captchaData.value) // 调试日志
    } else {
      Message.error(response.data.msg || '获取验证码失败')
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
    Message.error('获取验证码失败，请重试')
  }
}

// 记住密码功能
const setRememberPassword = (checked) => {
  // TODO: 实现记住密码功能
}

// 登录提交
const handleSubmit = async () => {
  setLoading(true)
  
  try {
    // 准备登录数据
    const loginParams = {
      username: userInfo.username,
      password: userInfo.password,
      captcha: userInfo.captcha,
      captchaId: userInfo.captchaId
    }
    console.log('登录参数:', loginParams) // 调试日志
    
    // 调用登录API
    const response = await login(loginParams)
    console.log('登录响应:', response.data) // 调试日志
    
    if (response.data.code === 0) {
      const { user, token, expiresAt } = response.data.data
      
      // 存储Token
      setToken(token)
      
      // 更新store状态
      store.commit('user/SET_TOKEN', token)
      store.commit('user/SET_USER_INFO', {
        id: user.uuid,
        username: user.userName,
        nickName: user.nickName,
        avatar: user.headerImg,
        email: user.email,
        phone: user.phone,
        role: user.authorityId,
        enable: user.enable
      })
      
      Message.success('登录成功')
      
      // 跳转到练习页面
      await router.push({ name: 'practice' })
    } else {
      Message.error(response.data.msg || '登录失败')
      // 登录失败后清空验证码输入并刷新验证码
      userInfo.captcha = ''
      await refreshCaptcha()
    }
  } catch (error) {
    console.error('登录失败:', error)
    Message.error('登录失败，请检查网络连接')
    // 登录失败后清空验证码输入并刷新验证码
    userInfo.captcha = ''
    await refreshCaptcha()
  } finally {
    setLoading(false)
  }
}

// 页面加载时获取验证码
onMounted(() => {
  refreshCaptcha()
})
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

/* 验证码样式 */
.captcha-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 120px;
  height: 40px;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-fill-1);
  transition: all 0.3s;
  overflow: hidden;
}

.captcha-image:hover {
  border-color: var(--color-primary-6);
  background: var(--color-fill-2);
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
  background: white;
}

.captcha-placeholder {
  color: var(--color-text-3);
  font-size: 12px;
  text-align: center;
}
</style>

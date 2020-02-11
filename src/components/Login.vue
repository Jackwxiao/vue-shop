<template>
  <div class="loginWrapper">
    <div class="loginBox">
      <div class="avaterBox">
        <img src="../assets/images/logo.png" alt="picture" />
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="formLogin" :rules="formLoginRules" label-width="0" class="loginForm">
        <el-form-item prop="username">
          <el-input v-model="formLogin.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="formLogin.password"
            prefix-icon="iconfont icon-password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="restForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formLogin: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证对象
      formLoginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    restForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.formLogin)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登陆成功！')
        // 登陆成功后客户端保存返回的 token 到sessionStorage 中，因为只需在网站打开期间生效
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home') // 编程式导航跳转到后台主页
      })
    }
  }
}
</script>

<style lang="less" scoped>
.loginWrapper {
  height: 100%;
  background-color: cadetblue;
}
.loginBox {
  position: absolute;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px 0 rgba(0, 0, 2, 0.5);
  .avaterBox {
    width: 135px;
    height: 135px;
    border: 1px solid grey;
    border-radius: 50%;
    padding: 10px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px 0 rgba(0, 0, 2, 0.5);
    img {
      width: 100%;
      height: 100%;
      border: 1px solid grey;
      background-color: #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px 0 rgba(0, 0, 2, 0.5);
    }
  }
}
.loginForm {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/user.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <!-- 
          label-width 左侧文本的占位
          :model="表单数据对象"
          :rules="表单验证规则对象"
          prop="验证规则"
          ref="实例对象"
       -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            prefix-icon="iconfont icon-wode"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <!-- 给element组件添加类名可以操作其样式 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="success" @click="addDialogVisible = true"
            >注册</el-button
          >
          <el-button type="info" @click="resetLoginForm('loginFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 
        注册用户的对话框 当点击添加用户的时候会弹出此对话框
        visible.sync 控制对话框的显示和隐藏 绑定的是一个布尔值
        before-close 对话框关闭之前触发的事件
        @close 对话框关闭时调用的事件
     -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <!-- :rules验证规则对象 -->
      <!-- prop验证规则属性 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确定密码" prop="password_confirmation">
          <el-input v-model="addForm.password_confirmation"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- slot="footer" 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <!-- 点击取消隐藏对话框 -->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据对象
      loginForm: {
        email: "12345678@qq.com",
        password: "12345678",
      },
      //   表单验证规则对象
      //   required 是否为必填项
      //   message提示消息
      //   trigger 触发行为
      loginFormRules: {
        email: [
          { required: true, message: "请输入账号", trigger: "blur" },
          //   长度限制看自身数据定义情况
          {
            min: 10,
            max: 20,
            message: "长度在 10 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 8,
            max: 15,
            message: "密码的长度在8~15个字符之间",
            trigger: "blur",
          },
        ],
      },
      // 对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        name: "",
        password: "",
        password_confirmation: "",
        email: "",
      },
      addFormRules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "账号的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 8,
            max: 15,
            message: "密码的长度在8~15个字符之间",
            trigger: "blur",
          },
        ],
        password_confirmation: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 8,
            max: 15,
            message: "密码的长度在8~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    //   重置表单
    resetLoginForm(formName) {
      // resetFields 表单实例对象的方法 用于重置表单

      this.$refs[formName].resetFields();
    },
    // 登录操作
    login() {
      // validate()表单实例对象方法 用于对表单进行预验证  里面接收一个回调函数 函数的参数就是结果 所以这里直接用箭头函数的省略写法 function(valid){}
      //   验证成功返回true 失败false
      this.$refs.loginFormRef.validate(async (valid) => {
        //   直接取反 为false直接return 不发起请求
        if (!valid) return;
        // 验证成功 发起登录请求
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        // 登录失败
        if (res.status !== 200) return this.$message.error(res.message);
        // 登录成功
        this.$message.success(res.message);
        // 1.登录成功之后的 token，保存到客户端的 sessionStorage 中 sessionStorage是会话期间的存储机制
        console.log(res);
        localStorage.setItem("name", res.data[0].name);
        localStorage.setItem("id", res.data[0].id);
        localStorage.setItem("avatar", res.data[0].avatar);
        localStorage.setItem("jianjie", res.data[0].jianjie);
        // 还有就是把用户的id保存到window.sessionStorage.setItem("id", res.data.id); 这上面 当跟后台获取用户数据的时候就可以发送用户id来进行获取
        // 2.项目中除了登录之外的其它API接口，必须在登录之后才能访问
        // 3.token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        // 4.通过编程式导航跳转到后台主页，路由地址是 /home 使用路由实例对象$router.push()方法跳转
        // 客户端的token可以通过F12 Application->Session Storage 查看
        this.$router.push("/home").catch(() => {});
      });
    },
    addDialogClosed() {
      // 调用form表单的实例对象ref里自带的resetFields方法来清空表单
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      // 发起注册请求
      // 调用form表单的实例对象ref里自带的validate方法来检查输入项有没有出错
      // 没有出错返回true 有错返回false
      this.$refs.addFormRef.validate(async (valid) => {
        //console.log(valid);
        // 校验失败 直接结束函数
        if (!valid) return;
        // 校验成功 可以发起添加用户的请求
        // 注册用户: 路径:register 方法:post 参数name password password_confirmation email
        // 接口校验成功statuts值为201
        // 判断两次输入的密码是否一样
        if (!(this.addForm.password == this.addForm.password_confirmation)) {
          return this.$message.error("输入的密码不一样，请重新输入");
        }
        const { data: res } = await this.$http.post("register", this.addForm);
        if (res.status !== 200) {
          // res.meta.msg返回的提示信息
          return this.$message.error(res.message);
        }
        console.log(res.data.name);
        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        // 注册成功
        this.$message.success(res.message);
        console.log(res.data);
        // 1.注册成功之后的 token，保存到客户端的 sessionStorage 中 sessionStorage是会话期间的存储机制
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("avatar", res.avatar);
        localStorage.setItem("jianjie", res.jianjie);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_box {
  width: 24rem;
  height: 18rem;
  background-color: #fff;
  border-radius: 1rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 3.466667rem;
    width: 3.466667rem;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 0.533333rem;
  //   自动适应内外边距
  box-sizing: border-box;
}
.btn {
  display: flex;
  //   元素右对齐
  justify-content: flex-end;
}
</style>
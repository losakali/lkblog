<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>我的设置</span>
    </div>
    <el-row>头像设置</el-row>
    <el-row type="flex" align="middle">
      <!-- 图片上传 -->
      <!-- 
      action 图片要上传到的API地址
      headers  请求头 因为后台上传接口要用到token
      on-success 上传成功后调用
      on-remove  处理移除图片操作的函数
      on-preview 处理图片的预览效果
      limit      限制上传的数量
      on-exceed  文件超出上传限制时调用的函数
     -->
      <el-upload
        class="avatar-uploader"
        :action="uploadURL"
        :show-file-list="true"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        ref="myUpload"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
        list-type="picture-card"
        :limit="1"
        :on-exceed="limit"
        :with-credentials="true"
        :file-list="listArr"
      >
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg文件，且不超过2mb
        </div>
      </el-upload>
    </el-row>
    <el-row>个人简介</el-row>
    <el-row>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="jianjie">
          <el-input
            type="jianjie"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入内容"
            v-model="ruleForm.jianjie"
            maxlength="30"
            minlength="3"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-button class="btn" type="primary" @click="add()">确定</el-button>
    </el-row>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="this.listArr[0].url" alt="" class="previewImg" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      listArr: [
        {
          url: "",
        },
      ],
      // 个人简介
      ruleForm: {
        id: localStorage.getItem("id"),
        jianjie: "",
      },
      //   简介路由规则
      rules: {
        jianjie: [
          {
            required: true,
            message: "请输入简介",
            trigger: "blur",
          },
          {
            min: 3,
            max: 30,
            message: "简介的长度在3~30个字符之间",
            trigger: "blur",
          },
        ],
      },
      //   文件上传的url
      uploadURL: "http://blog.losakali.top/public/index.php/blog/upload",
      previewVisible: false,
      //   用户id
      id: localStorage.getItem("id"),
      // 图片所在位置的url
      imgUrl: "http://blog.losakali.top/storage/app/public/tileImg/",
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    //   获取当前用户信息
    async getUser() {
      const { data: res } = await this.$http.post("blog/getUser", {
        id: localStorage.getItem("id"),
      });
      if (res.status !== 200) return this.$message.error(res.message);
      this.listArr.url = res.data[0].avatar;
      this.listArr[0].url = res.data[0].avatar;
      this.ruleForm.jianjie = res.data[0].jianjie;
      this.$message.success(res.message);
    },
    // 处理图片预览效果
    handlePreview(file) {
      // file 图片信息对象
      // 弹出对话框
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    async handleRemove(file) {
      // file 将要被移除的图片信息
      console.log(file.url);
      //   移除图片时判断用户有没有头像 有的话则移除当前头像
      var url = "";
      if (this.listArr[0].url) {
        //   有头像 截取字符串
        url = file.url.slice(this.imgUrl.length);
        console.log(url);
      } else {
        url = file.response.data.tmp_path;
      }
      const { data: res } = await this.$http.post("blog/delImg", {
        filename: "public/tileImg/" + url,
        id: localStorage.getItem("id"),
      });
      if (res.status !== 200) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.listArr[0].url = "";
    },
    //上传成功后的调用
    handleAvatarSuccess(response) {
      //   ’/storage/image/‘ 这个路径为你后端存储图片的软连接地址
      this.listArr[0].url = response.data.url;
      this.$message.success(response.message);
      this.addUserImg(response.data.url);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //清空上传图片列表
    clearFiles() {
      this.$refs["myUpload"].clearFiles();
    },
    limit() {
      this.$message.warning("当前只允许上传一张封面图");
    },
    // 数据库中添加图片操作 参数：图片地址
    async addUserImg(avatar) {
      const { data: res } = await this.$http.post("blog/addUserImg", {
        id: this.id,
        avatar: this.listArr[0].url,
      });
      if (res.status !== 200) return this.$message.error(res.message);
      //  成功的话可以在这里把用户的头像进行更新
    },
    // 添加简介
    add() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        // 发起修改/添加简介请求
        const { data: res } = await this.$http.post(
          "blog/addJianJie",
          this.ruleForm
        );
        if (res.status !== 200) return this.$message.error(res.message);
        this.$message.success(res.message);
      });
    },
  },
};
</script>

<style lang="less" scoped>
// 卡片视图样式
.el-card {
  width: 60rem;
  margin: 0 auto;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
//
.el-row {
  margin-bottom: 2.666667rem;
}
// 发布简介按钮样式
.btn {
  margin-top: 0.533333rem;
}
</style>
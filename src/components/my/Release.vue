<template>
  <div>
    <el-card>
      <!-- 
        提示区域 
        closable 隐藏警告栏关闭按钮
      -->
      <el-alert title="发布博客" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 
        步骤条区域
        active 默认激活的选项 从索引1开始
        activeIndex - 0   把字符串转换成数值
       -->
      <el-steps :active="activeIndex - 0" align-center>
        <el-step title="博客标题" icon="el-icon-s-home"></el-step>
        <el-step title="博客分类" icon="el-icon-s-order"></el-step>
        <el-step title="上传封面" icon="el-icon-picture"></el-step>
        <el-step title="填写内容" icon="el-icon-edit"></el-step>
      </el-steps>
      <!-- 
        表单区域 
        label-position 表单标签的位置
        prop 验证规则
      -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 
          tab栏区域 
          tab-position tab栏的位置
          before-leave tab栏切换时触发的事件
        -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="博客标题" name="1">
            <el-form-item label="博客标题" prop="blog_title">
              <el-input v-model="addForm.blog_title"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="博客分类" name="2">
            <el-form-item label="博客分类" prop="type_id">
              <!-- 
                级联选择器
                options 要渲染的数据对象
                props  级联选择器配置对象
                expand-trigger 触发级联选择器的行为
                v-model 选中项
               -->
              <el-cascader
                v-model="addForm.type_id"
                :options="blogType"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="上传封面" name="3">
            <!-- 图片上传 -->
            <!-- 
      action 图片要上传到的API地址
      headers  请求头 因为后台上传接口要用到token
      on-success 上传成功后调用
      on-remove  处理移除图片操作的函数
      on-preview 处理图片的预览效果
      limit      限制上传的数量
      on-exceed  文件超出上传限制时调用的函数
      :with-credentials="true" 携带登录请求头cookie
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
              list-type="picture"
              :limit="1"
              :on-exceed="limit"
              :with-credentials="true"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg文件，且不超过2mb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="填写内容" name="4">
            <!-- 载入富文本编辑器 -->
            <quill-editor v-model="addForm.blog_content"></quill-editor>
            <el-button type="primary" class="btn" @click="add">发布</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 图片预览对话框 -->
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
        <img :src="addForm.cover_image" alt="" class="previewImg" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateProps: {
        // 触发的方式
        expandTrigger: "hover",
        // 要显示的内容
        label: "type_name",
        // 选中的值
        value: "type_id",
      },
      // 博客分类
      blogType: [],
      // 帖子数据对象
      addForm: {
        userid: localStorage.getItem("id"),
        blog_status: 0,
        blog_title: "",
        type_id: "",
        cover_image: "",
        blog_content: "",
      },
      // 表单验证规则对象
      addFormrules: {
        blog_title: [
          {
            required: true,
            message: "请输入博客的标题",
            trigger: "blur",
          },
        ],
        type_id: [
          {
            required: true,
            message: "请选择博客分类",
            trigger: "blur",
          },
        ],
      },
      activeIndex: "1", //步骤条索引
      previewVisible: false, //对话框的隐藏与显示
      content: "",
      // 上传图片的后台url
      uploadURL: "http://blog.losakali.top/public/index.php/blog/upload",
    };
  },
  created() {
    // 获取博客分类
    this.getBlogType();
  },
  methods: {
    // tab栏切换事件
    // 参数是回调函数 参数一 即将进入的标签页 参数二 即将离开的标签页
    beforeTabLeave(activeName, oldActiveName) {
      // // 即将进入的标签页
      // console.log(activeName);
      // // 即将离开的标签页
      // console.log(oldActiveName);
      // 判断离开分类页时有没有选择分类 没有则不让其切换
      if (oldActiveName === "2" && this.addForm.type_id == "") {
        this.$message.error("请选择博客分类");
        return false;
      }
      if (oldActiveName === "3" && this.addForm.cover_image == "") {
        this.$message.error("请上传博客封面图片");
        return false;
      }
    },
    // 级联选择器选中项变化 会触发的函数
    handleChange() {
      console.log(this.addForm.type_id);
    },
    // 获取博客分类
    async getBlogType() {
      const { data: res } = await this.$http.post("blog/blogType");
      if (res.status !== 200) return this.$message.error(res.message);
      console.log(res);
      this.blogType = res.data;
      console.log(this.blogType);
    },
    // 发布博客
    add() {
      console.log(this.addForm);
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        }
        this.addForm.blog_status = 1;
        this.addForm.type_id = this.addForm.type_id[0];
        const { data: res } = await this.$http.post(
          "blog/addBlog",
          this.addForm
        );
        if (res.status !== 200) return this.$message.error(res.message);
        this.$message.success(res.message);
        this.$router.push("/home");
      });
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
      console.log(file);
      const { data: res } = await this.$http.post("blog/delImg", {
        filename: "public/tileImg/" + file.response.data.tmp_path,
      });
      if (res.status !== 200) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.addForm.cover_image = "";
    },
    //上传成功后的调用
    handleAvatarSuccess(response) {
      //   ’/storage/image/‘ 这个路径为你后端存储图片的软连接地址
      this.addForm.cover_image = response.data.url;
      this.$message.success(response.message);
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
  },
};
</script>

<style lang="less" scoped>
.btn {
  margin-top: 0.266667rem;
}
.previewImg {
  width: 100%;
}
.el-card {
  padding: 0 13.333333rem;
}
</style>
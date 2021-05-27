<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ username }}的博客</span>
        <span style="float: right; padding: 3px 0" type="text"
          >共{{ total }}篇</span
        >
      </div>
      <el-table :data="blogList" style="width: 100%" :key="Math.random()">
        <el-table-column label="日期">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <span>
              <el-tag :type="tagType(scope.row.type_id)" effect="plain">
                {{ tagLabel(scope.row.type_id) }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">
            <i class="el-icon-edit"></i>
            <span style="margin-left: 10px">{{ scope.row.blog_title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="封面">
          <template slot-scope="scope">
            <img
              :src="scope.row.cover_image"
              alt=""
              style="margin-left: 10px; width: 150px; height: 84px"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="success"
              icon="el-icon-search"
              @click="blog(scope.row.blog_id)"
              >查看</el-button
            >
            <el-button
              size="small"
              type="warning"
              icon="el-icon-search"
              @click="openDialog(scope.row.blog_id)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              icon="el-icon-search"
              @click="delBlog(scope.row.blog_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 
      分页区域
      size-change 选择每页显示多少条触发的事件
      current-change 页面值发生变化触发的函数
      current-page 当前显示第几页
      后台需要返回 当前页 pagenum 
      page-size 每页显示多少条
      layout 在页面上显示的功能组件
      total 总共有多少条数据
     -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 
        编辑博客对话框 当点击添加用户的时候会弹出此对话框
        visible.sync 控制对话框的显示和隐藏 绑定的是一个布尔值
        before-close 对话框关闭之前触发的事件
        @close 对话框关闭时调用的事件
     -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormrules"
        ref="editFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="博客标题" prop="blog_title">
          <el-input v-model="editForm.blog_title"></el-input>
        </el-form-item>
        <el-form-item label="博客分类" prop="type_id">
          <!-- 
                级联选择器
                options 要渲染的数据对象
                props  级联选择器配置对象
                expand-trigger 触发级联选择器的行为
                v-model 选中项
               -->
          <el-cascader
            v-model="editForm.type_id"
            :options="blogType"
            :props="cateProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="博客封面">
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
          <el-row>
            <el-col :span="8">
              <div class="imgbox">
                <img :src="editForm.cover_image" @click="handlePreview" />
              </div>
            </el-col>
            <el-col :span="16">
              <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :show-file-list="true"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                ref="myUpload"
                list-type="picture"
                :limit="1"
                :on-exceed="limit"
                :on-remove="handleRemove"
                :with-credentials="true"
              >
                <el-button size="small" type="primary">更改封面</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg文件，且不超过2mb
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="博客内容">
          <!-- 载入富文本编辑器 -->
          <quill-editor v-model="editForm.blog_content"></quill-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBlog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="editForm.cover_image" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      // 博客类型
      options: [
        {
          type: "",
          label: "日常",
        },
        {
          type: "success",
          label: "前端",
        },
        {
          type: "info",
          label: "后端",
        },
        {
          type: "danger",
          label: "电脑硬件",
        },
        {
          type: "warning",
          label: "软件",
        },
      ],
      previewVisible: false, //对话框的隐藏与显示
      // 级联选择器配置对象
      cateProps: {
        // 触发的方式
        expandTrigger: "hover",
        // 要显示的内容
        label: "type_name",
        // 选中的值
        value: "type_id",
      },
      // 博客分类
      blogType: "",
      // 表单数据对象
      editForm: {
        blog_id: "",
        blog_title: "",
        type_id: "",
        cover_image: "",
        blog_content: "",
      },
      //   表单验证规则
      editFormrules: {
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
      dialogVisible: false,
      blogList: [],
      username: localStorage.getItem("name"),
      total: 0,
      queryInfo: {
        id: localStorage.getItem("id"),
        size: 5,
        page: 1,
      },
      // 上传图片的后台url
      uploadURL: "http://blog.losakali.top/public/index.php/blog/upload",
      // 图片上传组件的headers请求头对象
      // 截取图片的url地址
      imgUrl: "http://blog.losakali.top/storage/app/",
    };
  },
  created() {
    //   获取博客
    this.getBlog();
    // 获取博客分类
    this.getBlogType();
  },
  // 计算
  computed: {
    tagLabel() {
      return function (item) {
        return this.options[item - 1]["label"];
      };
    },
    tagType() {
      return function (item) {
        return this.options[item - 1]["type"];
      };
    },
  },
  methods: {
    async getBlog() {
      console.log(this.queryInfo.id);
      const { data: res } = await this.$http.post(
        "blog/myBlog",
        this.queryInfo
      );
      if (res.status !== 200) return;
      console.log(res.data);
      this.blogList = res.data.data;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize;
      this.getBlog();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getBlog();
    },
    // 查看
    blog(blog_id) {
      this.$router.push("/blog/" + blog_id);
    },
    // 对话框关闭事件
    dialogClosed() {
      this.getBlog();
    },
    // 编辑博客
    editBlog() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        }
        this.editForm.type_id = this.editForm.type_id[0];
        console.log(this.editForm);
        const { data: res } = await this.$http.post(
          "blog/upBlog",
          this.editForm
        );
        if (res.status !== 200) return this.$message.error(res.message);
        this.$message.success(res.message);
        this.getBlog();
        this.dialogVisible = false;
      });
    },
    // 获取博客
    async openDialog(id) {
      this.dialogVisible = true;
      const { data: res } = await this.$http.get("blog/blogId/" + id);
      if (res.status !== 200) return this.$message.error(res.message);
      this.editForm.blog_title = res.data[0].blog_title;
      this.editForm.cover_image = res.data[0].cover_image;
      this.editForm.blog_content = res.data[0].blog_content;
      this.editForm.type_id = res.data[0].type_id;
      this.editForm.blog_id = res.data[0].blog_id;
    },
    // 获取博客分类
    async getBlogType() {
      const { data: res } = await this.$http.post("blog/blogType");
      if (res.status !== 200) return this.$message.error(res.message);
      this.blogType = res.data;
    },
    // 处理图片预览效果
    handlePreview() {
      // file 图片信息对象
      // 弹出对话框
      this.previewVisible = true;
    },
    //上传成功后的调用
    async handleAvatarSuccess(response) {
      if (!this.editForm.cover_image == "") {
        var uslStr = this.editForm.cover_image.slice(this.imgUrl.length);
        const { data: res } = await this.$http.post("blog/imgdel", {
          filename: uslStr,
          blog_id: this.editForm.blog_id,
        });
        if (res.status !== 200) return this.$message.error(res.message);
        this.$message.success("更改成功");
        this.getBlog();
      }
      //   ’/storage/image/‘ 这个路径为你后端存储图片的软连接地址
      this.editForm.cover_image = response.data.url;
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
      this.$message.warning("请先移除图片");
    },
    // 处理移除图片的操作
    async handleRemove(file) {
      // file 将要被移除的图片信息
      console.log(file);
      const { data: res } = await this.$http.post("blog/imgdel", {
        filename: "public/tileImg/" + file.response.data.tmp_path,
      });
      if (res.status !== 200) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.editForm.cover_image = "";
    },
    // 删除博客
    async delBlog(id) {
      // $confirm 是element的弹框事件
      // 弹框询问是否删除
      // 如果用户确认删除 则返回值为字符串 confirm
      // catch 捕获错误消息
      // err=>err 是 return err 的简写 把错误信息return出去 因为点击取消会报错
      // 点击取消删除返回的是字符串 cancel
      const confirmResult = await this.$confirm(
        "此操作将永久删除该博客, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 取消删除
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      // 确认删除
      const { data: res } = await this.$http.post("blog/delblog", {
        blog_id: id,
      });
      if (res.status !== 200) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.reload();
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  padding: 0 8rem;
}
.text {
  font-size: 0.373333rem;
}

.item {
  margin-bottom: 0.48rem;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.el-pagination {
  margin-top: 2.666667rem;
}
.previewImg {
  width: 100%;
}

.imgbox {
  width: 8rem;
  overflow: hidden;
  img {
    width: 100%;
    height: 5.333333rem;
  }
}
.box-card {
  position: relative;
}
</style>
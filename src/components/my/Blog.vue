<template>
  <div class="box">
    <el-card>
      <div id="blog" class="ql-snow ql-editor">
        <!-- 把div的class设置为 ql-snow ql-editor 富文本编辑器的样式才能生效-->
      </div>
    </el-card>
    <el-card style="margin-top: 20px">
      <div class="content">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          :inline="true"
        >
          <el-form-item prop="comment_content">
            <el-input
              type="textarea"
              :placeholder="pltext"
              v-model="addForm.comment_content"
              maxlength="30"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="btn" @click="add()"
          >发表评论</el-button
        >
      </div>
    </el-card>
    <el-table
      :data="comment"
      style="width: 100%; margin-bottom: 20px"
      border
      default-expand-all
    >
      <!-- :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->
      <el-table-column label="博客id" sortable width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.blog_id }}</p>
          <p>{{ scope.row.createtime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="内容" sortable width="180">
        <template slot-scope="scope">
          {{ scope.row.comment_content }}
        </template>
      </el-table-column>
      <el-table-column label="评论人id" sortable width="180">
        <template slot-scope="scope">
          {{ scope.row.replyid }}
        </template>
      </el-table-column>
      <el-table-column sortable width="180">
        <el-button type="success" size="mini" round>回复</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 隐藏文本
      pltext: "请输入内容",
      blog_id: "",
      blog: "",
      // 评论内容
      comment: [],
      // 评论表单对象
      addForm: {
        // 评论人id
        userid: localStorage.getItem("id"),
        // 博客id
        blog_id: "",
        // 目标回复 人 id
        replyid: "",
        // 评论/回复内容
        comment_content: "",
      },
      // 表单验证规则
      addFormRules: {
        comment_content: [
          {
            required: true,
            message: "请输入评论内容",
            trigger: "blur",
          },
          {
            min: 5,
            max: 30,
            message: "回复长度在5到30个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getBlog();
  },
  methods: {
    async getBlog() {
      // 获取动态路由传递过来的参数 this.$route.params.参数名 记住 这个跟那个跳转的路由不一样 不用加r
      const { data: res } = await this.$http.get(
        "blog/blogId/" + this.$route.params.id
      );
      if (res.status !== 200) return this.$message.error(res.message);
      this.blog = res.data;
      // 获取博客发表人id
      this.addForm.blog_id = res.data[0].blog_id;
      this.addForm.replyid = res.data[0].id;
      // 渲染博客到页面上
      this.comment = res.comment;
      document.getElementById("blog").innerHTML = res.data[0].blog_content;
      console.log(res);
    },
    // 发表评论
    add() {
      if (!localStorage.getItem("id"))
        return this.$message.error("请先登录再进行评论");
      this.addForm.userid = localStorage.getItem("id");
      this.$refs.addFormRef.validate(async (valid) => {
        //console.log(valid);
        // 校验失败 直接结束函数
        if (!valid) return;
        console.log(this.addForm);
        const { data: res } = await this.$http.post(
          "blog/content",
          this.addForm
        );
        if (res.status !== 200) return this.$message.error(res.message);
        // 清空表单
        this.$refs.addFormRef.resetFields();
        this.getBlog();
        this.$message.success(res.message);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  width: 80rem;
  height: 100%;
  margin: 0 auto;
}
.content {
  display: flex;
  align-items: center;
  .btn {
    margin-left: 0.266667rem;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
.el-card {
  position: relative;
}
.el-table {
  position: relative;
}
</style>
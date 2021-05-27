<template>
  <el-container>
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><h2>博客</h2></span>
          <div style="float: right; padding: 0.08rem 0" type="text">
            共
            <h2 style="display: inline-block; color: #f2711c">
              {{ total }}
            </h2>
            篇
          </div>
        </div>
        <!-- 表格区域 -->
        <el-table :data="blogList" style="width: 100%">
          <el-table-column>
            <template slot-scope="scope">
              <!-- el-card 不能直接给el-card加flex布局 不起作用的 给里面的元素加可以 -->
              <el-card class="box_card" @click.native="blog(scope.row.blog_id)">
                <div class="box">
                  <!-- 左边 -->
                  <div class="left">
                    <h2>{{ scope.row.blog_title }}</h2>
                    <div class="time_tag">
                      <span
                        ><i
                          class="el-icon-s-order"
                          style="margin-right: 0.266667rem"
                        ></i
                        >{{ scope.row.create_time }}</span
                      >
                      <span>
                        <el-tag
                          :type="tagType(scope.row.type_id)"
                          effect="plain"
                        >
                          {{ tagLabel(scope.row.type_id) }}
                        </el-tag>
                      </span>
                    </div>
                  </div>
                  <!-- 右边 -->
                  <div class="right">
                    <img :src="scope.row.cover_image" alt="" />
                  </div>
                </div>
              </el-card>
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
      <div class="right_card">
        <!-- 搜索框 -->
        <el-input
          placeholder="请输入内容"
          style="margin-bottom: 5rem"
          v-model="sousuo"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getSou()"
          ></el-button>
        </el-input>

        <!-- 日期组件 -->
        <el-card>
          <div class="riqi">日期</div>
          <el-date-picker
            @change="getBlog"
            v-model="queryInfo.query"
            value-format="yyyy-MM-dd"
            align="center"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-card>
        <!-- 标签 -->
        <el-card style="margin-top: 5rem">
          <div class="riqi">标签</div>
          <el-tag
            v-for="(item, index) in options"
            :key="index"
            :type="item.type"
            effect="dark"
            style="margin-right: 0.533333rem; margin-top: 0.533333rem"
            @click="getTag(index)"
          >
            {{ item.label }}
          </el-tag>
        </el-card>
      </div>
    </el-main>
    <el-aside width="21.333333rem"> </el-aside>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 搜索内容
      sousuo: "",
      // 博客数据对象
      blogList: [],
      // 分页对象参数 size每页显示的条数 page 当前页码
      queryInfo: {
        query: "",
        size: 5,
        page: 1,
      },
      // 数据条数
      total: 0,
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  created() {
    // 获取所有博客
    this.getBlog();
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
    // 获取所有博客
    async getBlog() {
      const { data: res } = await this.$http.get("blog/allBlog", {
        params: this.queryInfo,
      });
      if (res.status !== 200) return;
      console.log(res);
      this.blogList = res.data.data;
      this.total = res.data.total;
    },
    blog(blog_id) {
      this.$router.push("/blog/" + blog_id);
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
    // 根据博客标签获取博客
    async getTag(typeId) {
      const { data: res } = await this.$http.post("blog/getTypeBlog", {
        type_id: typeId + 1,
        size: this.queryInfo.size,
      });
      if (res.status !== 200) return this.$message.error(res.message);
      this.blogList = res.data.data;
      this.total = res.data.total;
    },
    // 搜索博客
    async getSou() {
      if (!this.sousuo) return this.$message.error("请输入搜索内容");
      const { data: res } = await this.$http.post("blog/sousuo", {
        sousuo: this.sousuo,
        size: this.queryInfo.size,
      });
      if (res.status !== 200) return this.$message.error(res.message);
      this.blogList = res.data.data;
      this.total = res.data.total;
      this.sousuo = "";
    },
  },
};
</script>

<style lang="less" scoped>
.el-main {
  display: flex;
}
.box-card {
  position: relative;
  width: 60%;
  margin: 0 auto;
}
.box {
  display: flex;
  justify-content: space-between;
}
.left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding-right: 0.533333rem;
  .time_tag {
    display: flex;
    justify-content: space-between;
  }
}
.right {
  width: 9.333333rem;
  height: 6.666667rem;
  border-radius: 3%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.el-card:hover {
  cursor: pointer;
}
// 去除表格高亮
table-tranparent.el-table tbody tr:hover > td {
  background-color: #ffffff !important;
}

.table-tranparent.el-table tbody tr:hover {
  background-color: #ffffff !important;
}

.clearfix {
  display: flex;
  justify-content: space-between;
}
.clearfix:after {
  clear: both;
}
.el-pagination {
  margin-top: 13.333333rem;
}
.riqi {
  width: 100%;
  height: 1.333333rem;
  line-height: 1.333333rem;
  border-bottom: 0.026667rem solid #ccc;
  margin-bottom: 1.333333rem;
}
.right_card {
  position: relative;
  width: 21.333333rem;
}
</style>
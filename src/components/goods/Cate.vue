<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showDialog">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
    <tree-table
      class="table"
      border
      index-text="#"
      show-index
      :expand-type="false"
      :selection-type="false"
      show-row-hover
      :data="cateList"
      :columns="columns"
    >
      <!-- 是否有效 -->
      <template slot="istrue" scope="scope">
        <i
          class="el-icon-success"
          v-if="scope.row.cat_deleted === false"
          style="color: lightgreen;"
        ></i>
        <i class="el-icon-error" v-else style="color: red;"></i>
      </template>
      <!-- 排序 -->
      <template slot="order" scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
        <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="options">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
      </template>
    </tree-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addCateDialogVisible" width="50%" @close="closeReset">
      <el-form :model="addCate" :rules="addCateRules" ref="addCateRef" label-width="100px">
        <el-form-item label="商品类名" prop="cat_name">
          <el-input v-model="addCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            expandTrigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表
      cateList: [],
      total: 0,
      columns: [
        {
          label: '类名',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'istrue'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'options'
        }
      ],
      addCateDialogVisible: false,
      // 添加分类的表单数据
      addCate: {
        // 将要添加的分类名
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 默认添加的层级为1级分类
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入商品类名', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的 id 数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showDialog() {
      this.getParentCate()
      this.addCateDialogVisible = true
    },
    async getParentCate() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    parentCateChange() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组的长度大于0 ，证明选中了父级分类，反之则反
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCate.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 给当前分类的等级赋值
        this.addCate.cat_level = this.selectedKeys.length
      } else {
        this.addCate.cat_pid = 0
        this.addCate.cat_level = 0
      }
    },
    closeReset() {
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCate.cat_pid = 0
      this.addCate.cat_level = 0
    },
    addCateSub(){
        this.$refs.addCateRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCate)
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.addCateDialogVisible = false
        this.getCateList()
    })
    }
}
}
</script>

<style lang="less" scoped>
.table {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>

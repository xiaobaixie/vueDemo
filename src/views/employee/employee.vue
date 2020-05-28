<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户中心</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.emplName" clearable @clear="listUser">
            <el-button slot="append" icon="el-icon-search" @click="listUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" stripe height="250" border style="width: 100%" max-height="250">
        <el-table-column label="序号" type="index" fixed/>
        <el-table-column label="账户" width="100" prop="emplName" />
        <el-table-column label="姓名" width="80" prop="realName" />
        <el-table-column label="性别" width="60" prop="sexDesc" />
        <el-table-column label="生日" prop="birthday" :formatter="formatDate" width="100"/>
        <el-table-column label="手机" prop="phone" width="100"/>
        <el-table-column label="邮箱" prop="email" width="120"/>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="modifyTime" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditDialog(scope.row.emplId)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.row.emplId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="账户" prop="emplName">
          <el-input v-model="addForm.emplName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="addForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sexDesc">
          <el-input v-model="addForm.sexDesc"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="addForm.birthday"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input v-model="addForm.nativePlace"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%"
    @close="editDialogClosed">
      <el-form :model="editForm"  ref="editFormRef" label-width="70px">
        <el-form-item label="账户" prop="emplName">
          <el-input v-model="editForm.emplName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="editForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sexDesc">
          <el-input v-model="editForm.sexDesc"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="editForm.birthday"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input v-model="editForm.nativePlace"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        emplName: '',
        pageNum: 1,
        pageSize: 10
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        emplName: '',
        password: '',
        realName: '',
        sexDesc: '',
        birthday: '',
        phone: '',
        email: '',
        nativePlace: ''
      },
      addFormRules: {
        emplName: [
          {required: true, message: '请输入账户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      editDialogVisible: false,
      editForm: {}
    }
  },
  created () {
    this.listUser()
  },
  methods: {
    async listUser () {
      const res = await this.$http.get('/employee/index', {params: this.queryInfo})
      if (res.code !== '00') {
        return this.$msg.error(res.message)
      }
      this.userList = res.data.list
      this.total = res.data.total
    },
    formatDate (row, column) {
      let date = row[column.property]
      if (date === undefined || date === null) {
        return ''
      }
      return this.moment(date).format('YYYY-MM-DD')
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.listUser()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.listUser()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$http({
        url: '/employee/insert',
        method: 'post',
        data: JSON.stringify(this.addForm)
      }).then(res => {
        if (res.code === '00') {
          this.$msg.success('添加用户成功')
          this.addDialogVisible = false
          this.listUser()
        } else {
          return this.$msg.error(res.message)
        }
      })
    },
    async showEditDialog (emplId) {
      const res = await this.$http.get('/employee/select?emplId=' + emplId)
      if (res.code !== '00') {
        return this.$msg.error(res.message)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    updateUser () {
      console.log('editForm', JSON.stringify(this.editForm))
      this.$http({
        url: '/employee/update',
        method: 'post',
        data: JSON.stringify(this.editForm)
      }).then(res => {
        if (res.code === '00') {
          this.$msg.success('修改用户成功')
          this.editDialogVisible = false
          this.listUser()
        } else {
          return this.$msg.error(res.message)
        }
      })
    },
    deleteUser (emplId) {
      this.$http({
        url: '/employee/delete',
        method: 'post',
        params: {
          emplId: emplId
        }
      }).then(res => {
        if (res.code === '00') {
          this.$msg.success('删除用户成功')
          this.listUser()
        } else {
          return this.$msg.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }

  .el-card {
    box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
  }
  .el-table {
    margin-top: 15px;
    font-size: 13px;
  }
  .el-pagination {
    margin-top: 15px;
  }
</style>

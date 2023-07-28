<template>
  <div class="activitylinkList-page">
    <div class="title"><el-tag>根</el-tag><span>{{ this.$route.query.name }}/ 活动关联用户列表</span></div>
    <filter-tool
      :filter-list="filterList"
      :form-data="formData"
    />
    <tab-list
      :current-value="currentValue"
      :tabs="tabs"
      @tabClick="selectStatus"
    />
    <div
      style="
              margin: 12px 0;
              height: 1px;
              background-color: #eeeeee;
              width: 100%;
          "
    />
    <div class="total-content">
      <div class="total-info">共查询到 {{ total }} 项</div>
      <div v-if="multipleSelection.length > 0" class="right-content">
        <div class="total-info">共选择  {{ multipleSelection.length }} 项</div>
        <div class="operator">
          <el-button type="text" class="pass-btn" @click="passItem(multipleSelection)">
            批量通过
          </el-button>
          <el-button type="text" class="fail-btn" @click="failItem(multipleSelection)">
            批量不通过
          </el-button>
          <el-button type="text" class="remove-btn" @click="removeItem(multipleSelection)">
            删除
          </el-button>
        </div>
      </div>
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="35"
        >
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="detailItem(scope.row)">
              详情
            </el-button>
            <el-button type="text" class="pass-btn" @click="passItem(scope.row)">
              通过
            </el-button>
            <el-button type="text" class="fail-btn" @click="failItem(scope.row)">
              不通过
            </el-button>
            <el-button type="text" class="remove-btn" @click="removeItem(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total > 10" style="margin-top: 16px; text-align: right">
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
    <vettingDetail ref="editModal" @addSuccess="refreshList" />
  </div>
</template>

<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import vettingDetail from '@/components/EditModal/IncentiveEdit/vettingDetail.vue'
import { getActiveLinkUser , getApprovalRewards} from '@/api/activities'
import { awardObjectType } from '@/utils/parameters'
export default {
  name: 'ActivitylinkList',
  components: {
    FilterTool,
    TabList,
    vettingDetail
  },
  props: {
  },
  data() {
    return {
      loading: false,
      pageSize: 20,
      currentPage: 1,
      total: 0,
      currentValue: -1,
      multipleSelection: [],
      tabs: {
        title: '状态：',
        radios: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '进行中',
            value: 1
          },
          {
            label: '已审批',
            value: 2
          },
          {
            label: '审核通过',
            value: 3
          },
          {
            label: '审核不通过',
            value: 4
          },
          {
            label: '已删除',
            value: 0
          }
        ]
      },
      columns: [
        {
          prop: 'index',
          label: '#',
          width: 60
        },
        {
          prop: 'identityType',
          label: '用户身份',
          width: 100
        },
        {
          prop: 'sharerEmail',
          label: '用户邮箱'
        },
        {
          prop: 'incentiveType',
          label: '激励类型'
        },
        {
          prop: 'rewardStatus',
          label: '状态'
        },
        {
          prop: 'rewardNum',
          label: '数量',
          width: 80
        },
        {
          prop: 'updatedTime',
          label: '最后更新'
        }
      ],
      tableData: [

      ],
      formData: {},
      // ===========
      rolelist: [],
      activetype: [{ label: 'Credit', value: 1 }, { label: 'Cash', value: 2 }, { label: 'coupon', value: 3 }, { label: 'discount', value: 4 }]
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'select',
          label: '用户身份：',
          placeholder: '全部',
          props: 'user_role',
          options: this.rolelist
        },
        {
          type: 'input',
          label: '用户邮箱：',
          placeholder: '请输入',
          props: 'userEmail'
        },
        {
          type: 'select',
          label: '激励类型：',
          placeholder: '全部',
          props: 'rewardType',
          options: this.activetype
        },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (formData) => {
            console.log(formData)
            this.formData = formData
            this.currentPage = 1
            this.getList()
          }
        }
      ]
    }
  },
  created() {
    const query_name = this.$route.query.name// 获取路由参数中的 ID
    const name = `活动关联用户列表-${query_name}` // 根据 ID 生成页面标题
    document.title = name // 设置页面标题
    this.tempRoute = Object.assign({}, this.$route)
    const route = Object.assign({}, this.tempRoute, { title: `${name}` })
    this.$store.dispatch('tagsView/updateVisitedView', route) // 修改历史路由的标题,
    for (const [value, label] of Object.entries(awardObjectType)) {
      this.rolelist.push({
        label,
        value: parseInt(value)
      })
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        activeId: this.$route.params.id,
        page: this.currentPage,
        size: this.pageSize,
        userEmail: this.formData.user_email || undefined, // filter
        user_role: this.formData.user_role || undefined,
        incentive_type: this.formData.incentive_type || undefined,
        rewardState: this.currentValue < 0 ? undefined : this.currentValue
      }
      getApprovalRewards(params)
        .then((data) => {
          const roleMap = new Map([
            ['1', '推荐者'],
            ['2', '被推荐者'],
            ['3', '双反']
          ])
          const statusMap = new Map([
            ['1', '进行中'],
            ['2', '审批中'],
            ['3', '审核通过'],
            ['4', '审核不通过'],
            ['5', '已删除']
          ])
          const { res } = data
          this.tableData = res.list.map(({ user_role, rewardState, ...rest }) => {
            return {
              user_role: roleMap.get(user_role),
              rewardState: statusMap.get(rewardState),
              ...rest
            }
          })
          this.total = res.totalCount
          this.tableData.forEach((e, i) => {
            e.index = this.pageSize * (this.currentPage - 1) + i + 1
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    refreshList(a) {
    },

    selectStatus(value) {
      this.currentValue = value
      this.getList()
    },
    detailItem(row) {
      const item = {
        ...row
      }
      console.log(item)
      this.$refs.editModal.show(item)
    },
    passItem(row) {
      console.log('vetting', row)
      this.$alert('是否通过审批', '审批通过', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    },
    failItem(row) {
      this.$confirm('Confirm to remove ?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then
      console.log('vetting', row)
    },
    removeItem(row) {
      console.log('vetting', row)
    },
    // ======own
    handleSelectionChange(val) {
      console.log('val', val)
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  text-align: left;
  margin-top: 20px ;
  margin-bottom: 32px ;
  .el-tag--medium {
    background: #2B7DE1;
    color: #FFF;
    font-size: 12px;
    font-weight: 500;
    margin-right: 12px;
    height: auto;
  }
}
.activitylinkList-page {
    padding: 20px;
}
.total-info{
  color: #ADADAD;;
  font-size: 12px;
}
.pass-btn{
  color: #00AA3A;;
}
.fail-btn{
  color: #FF3232;;
}
.remove-btn{
  color: #ADADAD;;
}
.total-content{
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 17px;
  .right-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    .total-info{
      margin-right: 40px;
    }
  }
}
.operator{
  button{
    font-size: 12px;
    padding: 0;
  }
}
</style>

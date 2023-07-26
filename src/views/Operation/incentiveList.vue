<template>
  <div class="incentiveList-page">
    <filter-tool
      :filter-list="filterList"
      :form-data="searchData"
    />
    <tab-list
      :current-value="currentValue"
      :tabs="tabs"
      :btn="btn"
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
    <div class="total-info">共查询到 {{ total }} 项</div>
    <div>
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.active_state === 2" style="color:#13ce66">Active</div>
            <div v-else-if="scope.row.active_state === 1" style="color:#ff4949">Inactive</div>
            <div v-else style="color:#EEEEEE">Expired</div>
          </template>
        </el-table-column>
        <el-table-column label="编号">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <el-tag effect="dark">
              {{ scope.row.parent_id }}
            </el-tag>
            {{ scope.row.active_name }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="生效时间">
          <template slot-scope="scope">
            <div>
              {{ scope.row.active_effect_time }}
            </div>
            <div>
              {{ scope.row.active_expired_time }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="detailItem(scope.row)">
              详情
            </el-button>
            <el-button v-if="scope.row.is_award_audit" type="text" @click="vettingItem(scope.row)">
              处理审批
            </el-button>
            <el-button v-else type="text" disabled style="color: #ADADAD;">
              无需审批
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
    <incentiveCreate ref="editModal" @addSuccess="refreshList" />
    <activityDetail ref="preveModal" @addSuccess="prevRefreshList" />
  </div>
</template>

<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import incentiveCreate from '@/components/EditModal/IncentiveEdit/incentiveCreate.vue'
import activityDetail from '@/components/EditModal/IncentiveEdit/activityDetail.vue'
import { getActivePages } from '@/api/activities'
import { changeActiveType, awardObjectType, awardType } from '@/utils/parameters'

export default {
  name: 'IncentiveList',
  components: {
    FilterTool,
    TabList,
    incentiveCreate,
    activityDetail
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      pageNum: 1,
      total: 1,
      currentValue: -1,
      btn: {
        label: '创建活动',
        type: 'primary',
        click: this.addNewActivity
      },
      tabs: {
        title: '状态：',
        radios: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '已激活',
            value: 2
          },
          {
            label: '未激活',
            value: 1
          },
          {
            label: '已过期',
            value: 3
          }
        ]
      },
      columns: [
        {
          prop: 'active_type',
          label: '活动类型'
        },
        {
          prop: 'fission_award_object_type',
          label: '激励方'
        },
        {
          prop: 'captain_award_type',
          label: '激励类型'
        }
      ],
      tableData: [],
      searchData: {},
      activeTypeOptions: [
        {
          label: '购后返现',
          value: 1
        },
        {
          label: '拼团',
          value: 2
        }
      ],
      activeAwardType: [
        {
          label: 'Discount',
          value: 1
        }
      ]
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'select',
          label: '活动类型：',
          placeholder: '请选择活动类型',
          props: 'active_type',
          options: this.activeTypeOptions
        },
        {
          type: 'input',
          label: '活动名称：',
          placeholder: '按活动名称搜索',
          props: 'active_name'
        },
        {
          type: 'datetime',
          label: '生效时间：',
          placeholder: '选择生效时间',
          props: 'active_effect_time'
        },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (searchData) => {
            console.log('searchData', searchData)
            this.searchData = searchData
            this.currentPage = 1
            this.getList()
          }
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        active_type: this.searchData.active_type || '',
        active_name: this.searchData.active_name || '',
        active_effect_time: this.searchData.active_effect_time || '',
        active_state: this.searchData.active_state || ''
      }
      getActivePages(params).then((data) => {
        console.log('data', data)
        this.loading = false
        this.tableData = data.res.list
        this.total = data.res.totalCount
        this.tableData.forEach((item) => {
          item.active_state = item.active_state * 1
          item.active_type = changeActiveType[(item.active_type * 1)]
          item.fission_award_object_type = awardObjectType[(item.fission_award_object_type * 1)]
          item.captain_award_type = awardType[(item.captain_award_type * 1)]
        })
      })
    },
    refreshList() {

    },
    prevRefreshList(id) {
      this.$refs.editModal.edit(id)
    },
    selectStatus(value) {
      this.searchData.active_state = value
      this.getList()
    },
    addNewActivity() {
      console.log('addNewActivity')
      this.$refs.editModal.show()
    },
    detailItem(row) {
      const item = {
        ...row
      }
      this.$refs.preveModal.show(item.id)
    },
    vettingItem(row) {
      console.log(row)
      this.$router.push({
        name: 'activitylinkList/:id',
        params: { id: row.id },
        query: { name: row.active_name }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.incentiveList-page {
  padding: 20px;
}
.total-info {
  font-size: 12px;
  color: #adadad;
}
</style>

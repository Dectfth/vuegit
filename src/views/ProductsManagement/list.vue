<template>
  <div class="ProductManagementList">
    <filter-tool :filter-list="filterList" :form-data="formData" />
    <tab-list
      :current-value="currentValue"
      :tabs="tabs"
      :note="note"
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
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :row-style="rowStyle"
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="" width="60">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.img"
              fit="fit"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <a
              :href="scope.row.url"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #2B7DE1;"
            >
              {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="SKU" width="250">
          <template slot-scope="scope">
            {{ scope.row.SKU }}
          </template>
        </el-table-column>
        <el-table-column label="标记 #Tags" width="250">
          <template slot-scope="scope">
            <div class="dataContainer">
              <div class="dataLength" style="color: #FF7A00;">{{ scope.row.Tags.length }}</div>
              <el-tag
                v-for="item in scope.row.Tags.data.slice(0, 2)"
                :key="item.label"
                size="mini"
                effect="plain"
                style="margin-left: 12px;"
              >
                {{ item.tagsItem }}
              </el-tag>
              <el-tag
                v-for="item in scope.row.Tags.data.slice(2, 3)"
                :key="item.label"
                size="mini"
                effect="plain"
                class="tag-ellipsis"
                style="margin-left: 12px;"
              >
                ...
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="活动 $Activities" width="250">
          <template slot-scope="scope">
            <div class="dataContainer">
              <div class="dataLength" style="color: #2B7DE1;">{{ scope.row.activities.length }}</div>
              <el-tag
                v-for="item in scope.row.activities.data.slice(0, 2)"
                :key="item.label"
                size="mini"
                effect="plain"
                style="margin-left: 12px;"
              >
                {{ item.activitiesItem }}
              </el-tag>
              <el-tag
                v-for="item in scope.row.activities.data.slice(2, 3)"
                :key="item.label"
                size="mini"
                effect="plain"
                class="tag-ellipsis"
                style="margin-left: 12px;"
              >
                ...
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评级" width="100">
          <template slot-scope="scope">
            {{ scope.row.grading }}
          </template>
        </el-table-column>
        <el-table-column width="40">
          <template slot-scope="scope">
            <div class="statusPoint" :style="{ background: scope.row.isActive ? '#00BC4B' : '#9b9191' }"></div>
            <!-- <el-tag v-if="scope.row.isActive" type="success">Active</el-tag>
            <el-tag v-else type="danger">Disabled</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="editItem(scope.row)">
              详情
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
    <ProductEdit ref="editModal" @addSuccess="refreshList" />
  </div>
</template>

<script>
import FilterTool from '@/components/Common/FilterTool.vue'
import TabList from '@/components/Common/TabList.vue'
import ProductEdit from '@/components/EditModal/PMEditModal/ProductEdit.vue'

export default {
  name: 'ProductManagementList',
  components: {
    FilterTool,
    TabList,
    ProductEdit
  },
  data() {
    return {
      loading: false,
      pageSize: 20,
      currentPage: 1,
      total: 2,
      // columns: [
      //   {
      //     prop: 'img',
      //     label: '',
      //     width: '100'
      //   },
      //   {
      //     prop: 'name',
      //     label: '商品名称'
      //   },
      //   {
      //     prop: 'SKU',
      //     label: 'SKU'
      //   },
      //   {
      //     prop: 'Tags',
      //     label: '标记 #Tags'
      //   },
      //   {
      //     prop: 'activities',
      //     label: '活动 $Activities'
      //   },
      //   {
      //     prop: 'grading',
      //     label: '评级'
      //   }
      // ],
      currentValue: -1,
      tabs: {
        title: '商品分类：',
        radios: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '生效中',
            value: 1
          },
          {
            label: '已失效',
            value: 0
          }
        ]
      },
      note: {
        icon: 'el-icon-refresh',
        text: '同步间隔：1 day 最新同步：',
        time: '2023年7月11日 22:00:00'
      },
      tableData: [
        {
          url: 'https://www.renogy.com/48v-50ah-smart-lithium-iron-phosphate-battery/',
          img: 'https://cdn11.bigcommerce.com/s-fhnch/images/stencil/640w/products/1729/23671/4850-54-US__56578.1689304084.jpg?c=2',
          name: '48V 50Ah Smart Lithium Iron Phosphate Battery',
          SKU: 'RBT50LFP48S-US',
          checked: false,
          isActive: true,
          Tags: {
            length: 2,
            data: [
              {
                tagsItem: '#HOT'
              },
              {
                tagsItem: '#NEW'
              }
            ]
          },
          activities: {
            length: 2,
            data: [
              {
                activitiesItem: '$Sale'
              },
              {
                activitiesItem: '$Prime Day'
              }
            ]
          },
          grading: 'A',
          updateTime: '2023年7月11日 22:00:00'
        },
        {
          url: 'https://www.renogy.com/12v-100ah-lithium-iron-phosphate-battery-w-bluetooth/',
          img: 'https://cdn11.bigcommerce.com/s-fhnch/images/stencil/1280x1280/products/1757/20547/RBT100LFP12-BT-G1-_01__81397.1689243842.jpg?c=2',
          name: '12V 100Ah Lithium Iron Phosphate Battery w/ Bluetooth',
          SKU: 'RBT100LFP12-BT-US',
          checked: false,
          isActive: false,
          Tags: {
            length: 3,
            data: [
              {
                tagsItem: '#HOT'
              },
              {
                tagsItem: '#NEW'
              },
              {
                tagsItem: '#FEATURED'
              }
            ]
          },
          activities: {
            length: 2,
            data: [
              {
                activitiesItem: '$Sale'
              },
              {
                activitiesItem: '$PD_NDD_01'
              }
            ]
          },
          grading: 'A',
          updateTime: '2023年7月14日 09:05:47'
        }
      ],
      // tableData: [],
      formData: {},
      TagsOptions: [],
      ActOptions: []
    }
  },
  computed: {
    filterList() {
      return [
        {
          type: 'input',
          label: '商品名称：',
          placeholder: '请输入商品名称',
          props: 'templateName'
        },
        {
          type: 'input',
          label: '商品SKU：',
          placeholder: '请输入商品SKU',
          props: 'SKU'
        },
        {
          type: 'select',
          label: '标记#Tags：',
          placeholder: '请选择标记#Tags',
          props: 'Tags',
          options: this.TagsOptions
        },
        {
          type: 'select',
          label: '活动 $Act：',
          placeholder: '请选择活动 $Act',
          props: 'Act',
          options: this.ActOptions
        },
        {
          type: 'button',
          label: '查询',
          btnType: 'primary',
          click: (formData) => {
            // this.formData = formData
            // this.currentPage = 1
            // this.getList()
          }
        }
      ]
    }
  },
  mounted() {
    // this.getList()
  },
  methods: {
    // getList() {
    //   this.loading = true
    //   const params = {
    //     size: this.pageSize,
    //     currentPage: this.currentPage,
    //     templateName: this.formData.templateName || ''
    //   }
    //   console.log('this.formData.templateName', this.formData.templateName)
    //   console.log('params', params)
    //   getEmailTemplatelist(params).then((res) => {
    //     this.loading = false
    //     this.tableData = res.data.temps
    //     this.total = res.data.totalCount
    //     this.tableData.forEach((item) => {
    //       const dateTime = new Date(item.updateTime)
    //       const formattedDateTime = `${dateTime.getFullYear()}-${this.padZero(dateTime.getMonth() + 1)}-${this.padZero(dateTime.getDate())} ${this.padZero(dateTime.getHours())}:${this.padZero(dateTime.getMinutes())}:${this.padZero(dateTime.getSeconds())}`
    //       item.updateTime = formattedDateTime
    //     })
    //   })
    // },
    // padZero(num) {
    //   return num.toString().padStart(2, '0')
    // },
    selectStatus(value) {
      this.currentValue = value
      // this.getList()
    },
    editItem(row) {
      const item = {
        ...row
        // isEdit: true
      }
      this.$refs.editModal.show(item)
    },
    refreshList() {
      // this.pageUrl = ''
      // this.formData.pageUrl = ''
      // this.formData.resName = ''
      // this.currentValue = -1
      // this.currentPage = 1
      // this.getList()
    },
    rowStyle(scope) {
      if (scope.row.isActive) {
        console.log('111')
      } else {
        return { backgroundColor: '#ccc', opacity: '0.5' }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .ProductManagementList{
      padding: 20px;
    .dataContainer{
      background-color: #FAFAFA;
      display: flex;
      align-items: center;
      border-radius: 4px;
      overflow: hidden;
      .dataLength{
        padding: 10px 15px;
        background: #EEEEEE;
        font-size: 18px;
        font-weight: 500;
      }
      .el-tag{
        color: #808080;
        border:0;
        background-color: #EEEEEE;
      }
      .tag-ellipsis{
        background-color: transparent;
      }
    }
    .statusPoint{
      width: 8px;
      height: 8px;
      border-radius: 4px;
    }
  }
</style>

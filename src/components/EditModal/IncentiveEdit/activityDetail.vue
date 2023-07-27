<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="630"
    :show-close="false"
    top="60px"
    class="incentive-edit-modal"
    :before-close="handleClose"
  >
    <div
      slot="title"
      class="edit-title"
    >
      <div>{{ modalTitle }}</div>
      <div class="switch-title">
        <el-switch
          v-model="formData.active"
          active-color="#00BC4B"
          inactive-color="#EEEEEE"
          :width="48"
        />
        <div
          class="switch-label"
          style="color: #00BC4B;"
        >
          Active
        </div>
      </div>
    </div>
    <div
      style="
          margin: 12px 0;
          height: 1px;
          background-color: #eeeeee;
          width: 100%;
        "
    />
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="数据统计"
        name="0"
      >
        <div class="flexcenter"><div class="model-label">数据统计</div><div class="model-label">数据更新时间：{{ Statistical_update_time }}</div> </div>
        <DateInput
          :statistical-list="statisticalList"
        >
        </DateInput>
      </el-tab-pane>
      <el-tab-pane
        label="活动配置"
        name="1"
      >
        <div class="model-label">活动配置</div>
        <el-form
          ref="configform"
          :rules="configformrules"
          :model="configform"
          :label-position="labelPosition"
          class="configform"
          label-width="130px"
        >
          <el-form-item
            label="活动节点"
            prop="parent_id"
            class="inputform"
            required
          >
            <el-input v-model="configform.parent_id"></el-input>
          </el-form-item>
          <el-form-item
            label="名称"
            prop="active_name"
            class="inputform"
          >
            <el-input v-model="configform.active_name"></el-input>
          </el-form-item>

          <el-form-item label="活动类型" prop="active_type">
            <el-select v-model="configform.active_type" placeholder="请选择活动类型">
              <el-option label="购后裂变" :value="1"></el-option>
              <el-option label="开团" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="configform.active_type == '2'"
            label="开团商品"
            prop="actparams"
            class="inputform"
          >
            <Tourproduct :tags="configform.group_skus" @add-tag="addTag" @delete-tag="deleteTag" @delete-all-tags="handleDeleteAllTags" />

          </el-form-item>
          <el-form-item label="活动生效时间" required class="inputform">
            <el-date-picker
              v-model="configform.active_during_time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="活动时区"
            prop="active_time_zone"
            class="inputform"
          >
            <el-input v-model="configform.active_time_zone"></el-input>
          </el-form-item>
          <div v-if="configform.active_type !== '2'">
            <div class="model-label">推荐者Referrer</div>
            <el-form-item
              label="前置订单限制"
              prop="sharer_before_order_limit"
              class="inputform"
              required
            >
              <div class="flexClass">
                <!-- <el-input v-model="configform.orderlimit"></el-input> -->

                <el-select v-model="configform.sharer_before_order_limit" placeholder="请选择活动类型">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>

                <el-checkbox-group
                  v-if="configform.sharer_before_order_limit"
                  v-model="configform.orderlimitOption "
                  style="padding: 0px 15px;"
                  @change="getorderlimitOption"
                >
                  <el-checkbox
                    v-for="item in orderlimitOptions"
                    :key="item.key"
                    :label="item.key"
                    class="checkbox"
                    size="medium"
                  >
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item v-if="configform.orderlimitOption.includes('sharer_order_date') && configform.sharer_before_order_limit" label="下单时间" required class="inputform">
              <el-date-picker
                v-model="configform.sharer_order_date"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              v-if="configform.orderlimitOption.includes('sharer_sku') && configform.sharer_before_order_limit"
              required
              label="商品SKU"
              prop="sharer_sku"
              class="inputform"
            >
              <el-input v-model="configform.sharer_sku"></el-input>
            </el-form-item>

            <el-form-item v-if="configform.orderlimitOption.includes('sharer_quantity') && configform.sharer_before_order_limit" label="件数" prop="sharer_quantity" class="inputform" required>
              <el-input v-model="configform.sharer_quantity"></el-input>
            </el-form-item>
            <el-form-item v-if="configform.orderlimitOption.includes('sharer_amount') && configform.sharer_before_order_limit" label="金额" prop="sharer_amount" class="inputform" required>
              <el-input v-model="configform.sharer_amount"></el-input>
            </el-form-item>

            <div class="model-label">被推荐者Referral</div>
            <el-form-item
              label="含推荐者自身"
              required
              prop="recommender_contains_self"
              class="inputform"
            >
              <el-input v-model="configform.recommender_contains_self"></el-input>
            </el-form-item>
            <el-form-item
              label="触发动作"
              prop="recommender_trigger_event"
              class="inputform"
            >
              <el-input v-model="configform.recommender_trigger_event"></el-input>
            </el-form-item>
            <el-form-item
              label="参与次数"
              prop="recommender_join_times"
              class="inputform"
              required
            >
              <el-input v-model="configform.recommender_join_times"></el-input>
            </el-form-item>
            <el-form-item
              label="目标商品限制"
              prop="recommender_sku"
              class="inputform"
              required
            >
              <el-input v-model="configform.recommender_sku"></el-input>
            </el-form-item>
            <el-form-item
              label="下单时间"
              prop="recommender_order_date"
              class="inputform"
              required
            >
              <el-input v-model="configform.recommender_order_date"></el-input>
            </el-form-item>
            <el-form-item
              label="商品SKU"
              prop="recommender_sku"
              class="inputform"
            >
              <el-input v-model="configform.recommender_sku"></el-input>
            </el-form-item>

          </div>
          <RewardRulesForm ref="RewardRulesForm" />
          <LimitNoticeForm ref="LimitNoticeForm" />
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="操作记录"
        name="2"
      >
        <div class="flexcenter"><div class="model-header">活动记录 <div class="model-label">用户 / 系统</div></div><div class="export-records">导出记录</div> </div>
        <el-table
          :data="recordsData"
          style="width: 100%"
        >
          <el-table-column
            v-for="item in columns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div
      style="
          margin: 12px 0;
          height: 1px;
          background-color: #eeeeee;
          width: 100%;
        "
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <div>
        <el-button
          type="info"
          @click="delsubmit"
        >
          取消
        </el-button>
        <el-button
          type="info"
          @click="editAct(configform.id)"
        >
          编辑活动
        </el-button>
      </div>
      <div>

        <el-button
          type="primary"
          @click="configureSubmit"
        >
          确认
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import DateInput from './dateinput.vue'
import RewardRulesForm from '@/components/EditForm/IncentiveForm/rewardRulesForm.vue'
import LimitNoticeForm from '@/components/EditForm/IncentiveForm/limitNoticeForm.vue'
import Tourproduct from '@/components/EditModal/IncentiveEdit/tourproduct.vue'

import {
  getActiveLink,
  getActiveLogDetail,
  getActive
} from '@/api/activities'
export default {
  components: {
    DateInput,
    RewardRulesForm,
    LimitNoticeForm,
    Tourproduct

  },
  data() {
    return {
      recordsData: [

      ],
      statisticalList: [], //
      modalTitle: '',
      dialogVisible: false,
      Statistical_update_time: '2023/07/05 ',
      formData: {
        active: false
      },
      activeName: '0', // 激励活动弹窗默认
      labelPosition: 'left', // form位置
      configform: { // 激励活动弹窗form
        group_skus: [],
        id: '', // 活动编号
        parent_id: '', // 活动节点
        active_name: '', // 名称
        active_type: '', // 活动类型
        active_during_time: '', // 活动生效时间
        sharer_before_order_limit: '', // 分享者前置订单限制
        sharer_order_date: '', // 分享者下单时间
        sharer_sku: '', // 分享者商品SKU
        sharer_amount: '', // 分享者商品金额限制
        sharer_quantity: '', // 分享者商品数量限制
        orderlimitOption: [],
        recommender_contains_self: '', // 被分享者是否前含推荐者自身限制 0:否|1:是
        recommender_trigger_event: '', // 被分享者触发动作限制：1下单2订阅3注册4加购
        recommender_join_times: '', // 被分享者参与次数
        recommender_sku: '', // 被分享者目标商品限制
        recommender_order_date: '' // 被分享者下单时间
      },
      limitshow: true, // orderlimit 控制显隐 接口再写

      configformrules: {
        node: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        active_name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        active_type: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        actparams: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        orderlimit: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        ordertime: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        productsku: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      columns: [
        {
          prop: 'type',
          label: '类型',
          width: 100
        },
        {
          prop: 'record',
          label: '记录'
        },
        {
          prop: 'user_email',
          label: '用户邮箱'

        },
        {
          prop: 'order_award_amount',
          label: '奖励记录'
        },
        {
          prop: 'order_no',
          label: '订单'
        },
        {
          prop: 'order_award_send_time',
          label: '更新时间'
        }
      ]
    }
  },
  computed: {
    orderlimitOptions() {
      const options = [
        { key: 'sharer_order_date', name: '下单时间' },
        { key: 'sharer_sku', name: '商品SKU' },
        { key: 'sharer_quantity', name: '件数' },
        { key: 'sharer_amount', name: '金额' }
      ]
      if (this.configform.sharer_before_order_limit) {
        return options
      } else {
        return []
      }
    }
  },
  mounted() {
  },
  methods: {
    addTag(tag) {
      this.configform.group_skus.push(tag)
    },
    deleteTag(tag) {
      const index = this.configform.group_skus.indexOf(tag)
      if (index !== -1) {
        this.configform.group_skus.splice(index, 1)
      }
    },
    handleDeleteAllTags() {
      this.configform.group_skus.splice(0)
    },
    getDetail(id) {
      getActiveLink(id).then((res) => {
        this.loading = false
        console.log(res, '..res')
      })
    },
    getLoglist(id) {
      getActiveLogDetail(id).then((res) => {
        this.loading = false
        const { data } = res
        this.recordsData = data
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async show(id, isEdit = true) {
      this.dialogVisible = true
      if (!isEdit) { return }
      const { data } = await getActive(id)
      this.loading = false
      const {
        active_effect_time,
        active_expired_time,
        recommender_contains_self,
        sharer_order_date,
        sharer_sku,
        sharer_quantity,
        sharer_amount,
        ...rest
      } = data
      this.configform = Object.assign(this.configform,
        {
          sharer_sku: data.sharer_sku,
          sharer_quantity: data.sharer_quantity,
          sharer_amount: data.sharer_amount,
          active_during_time: [active_effect_time * 1000, active_expired_time * 1000],
          recommender_contains_self: recommender_contains_self ? '是' : '否',
          orderlimitOption: [
            sharer_order_date ? 'sharer_order_date' : '', sharer_sku ? 'sharer_sku' : '', sharer_quantity ? 'sharer_quantity' : '', sharer_amount ? 'sharer_amount' : ''],
          ...rest
        }
      )

      this.modalTitle = this.configform.active_name
      this.getLoglist(id)

      this.$refs.RewardRulesForm.getData(this.configform)
      this.$refs.LimitNoticeForm.getData(this.configform)
    },
    configureSubmit() {
      console.log('提交')
    },
    delsubmit() {
      this.dialogVisible = false
      this.activeName = '0'
    },
    editAct(id) {
      const params = {
        id,
        isEdit: true
      }
      this.$emit('addSuccess', params)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
          this.activeName = '0'
        })
        .catch((_) => { })
    },
    getorderlimitOption(aa) {
      console.log(aa, 'a')
    }
  }
}
</script>
<style lang="scss">
.incentive-edit-modal{
  .el-dialog__body{
    padding-bottom: 0px;
  }
  >.el-input{
     width: 250px
     ;
  }
  .el-select{
     width: 250px;
  }
}

</style>
  <style lang="scss" scoped>
.edit-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .switch-title {
    display: flex;
    width: 100px;
    align-items: center;
    .switch-label {
      text-align: right;
      font-size: 14px;
      margin-left: 10px;
      font-weight: 500;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}
.tableContainer {
  padding: 10px;
  margin-top: 20px;
}
.model-label {
  color: #adadad;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 20px;
}
.configform {
  margin-bottom: 0;
  height: 680px !important;
  padding-bottom:0 ;
  overflow-y: scroll !important;
  .el-input {
    width: 250px;
  }
}
.flexClass {
  display: flex;
  align-items: flex-start;
    .el-checkbox__inner {
      height: 20px !important;
      width: 20px !important;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  .el-select {
    width: 250px!important;
  }
}
// .el-checkbox__inner {
//   height: 20px !important;
//   width: 20px !important;
// }
.el-form-item__label {
  color: #000;
  font-weight: 500;
}
.flexcenter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .model-header {
    display: flex;
    align-items: center;
    color: #000;
    font-size: 16px;
    font-weight: 500;
    .model-label {
      margin-bottom: 0;
      margin-left: 24px;
    }
  }
  .export-records {
    color:rgba(43, 125, 225, 1)
  }
}

</style>


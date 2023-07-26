<template>
  <el-form ref="rewardRulesForm" :model="rewardRulesForm" :rules="rewardRulesRules" label-position="left" label-width="130px" class="demo-Form demo-rewardRulesForm">
    <span class="partition">奖励对象Target</span>
    <el-form-item label="奖励对象" prop="fission_award_object_type">
      <el-select v-model="rewardRulesForm.fission_award_object_type" placeholder="请选择奖励对象">
        <el-option
          v-for="(op, index) in awardObjectTypeOption"
          :key="index"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </el-form-item>
    <div v-if="rewardRulesForm.fission_award_object_type == '1' || rewardRulesForm.fission_award_object_type == '3'">
      <span class="partition">分享者奖励 Referrer Reward</span>
      <el-table
        ref="awardCountTable"
        :data="awardCountData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          property="segment_number"
          label="分段"
          width="50"
        >
        </el-table-column>
        <el-table-column label="次数规则（后/含）">
          <el-table-column
            property="award_times_start"
            label="开始"
          >
          </el-table-column>
          -
          <el-table-column
            property="award_times_end"
            label="结束"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column
          property="award_type"
          label="奖励类型"
        >
        </el-table-column>
        <el-table-column
          property="award_matching"
          label="奖励匹配"
        >
        </el-table-column>
        <el-table-column
          property="single_award_value"
          label="单次奖励(Num/%)"
        >
        </el-table-column>
        <el-table-column
          width="50"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              style="color: #ADADAD;"
              @click.native.prevent="deleteRow(scope.$index, awardCountData)"
            >
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table
        v-if="isAdd"
        :data="addAwardCountData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          label=""
          width="50"
        >
        {{ addAwardCountData.index }}
        </el-table-column>
        <el-table-column
          label=""
        >
        <el-input v-model="addAwardCountData.input" placeholder="请输入前阶段"></el-input> - <el-input v-model="addAwardCountData.input" placeholder="请输入后阶段"></el-input>
        </el-table-column>
        <el-table-column
          label=""
        >
        <el-input v-model="addAwardCountData.input" placeholder="请输入奖励类型"></el-input>
        </el-table-column>
        <el-table-column
          label=""
        >
        <el-input v-model="addAwardCountData.input" placeholder="请输入奖励匹配"></el-input>
        </el-table-column>
        <el-table-column
          label=""
        >
        <el-input v-model="addAwardCountData.input" placeholder="请输入单次奖励"></el-input>
        </el-table-column>
        <el-table-column
          width="50"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              style="color: #ADADAD;"
              @click.native.prevent="deleteRow(scope.$index, awardCountData)"
            >
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <div class="awardCountFooter">
        <!-- <div>
          奖励计数共 <span style="color: #2B7DE1;">{{ awardCountDataTotal }}</span> 次，总计奖励 <span style="color: #2B7DE1;">{{ awardCountDataRewardTotal }}</span> Credit
        </div> -->
        <div>
          <el-button type="text" @click="addAwardCount">
            <i class="el-icon-plus"></i>新增奖励
          </el-button>
        </div>
      </div>
      <el-form-item label="发放方式" prop="sharer_award_distribute_type">
        <el-select v-model="rewardRulesForm.sharer_award_distribute_type" placeholder="请选择发放方式" clearable>
          <el-option
            v-for="(op, index) in awardDistributeTypeOption"
            :key="index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </el-form-item>
    </div>
    <div v-if="rewardRulesForm.fission_award_object_type == '2' || rewardRulesForm.fission_award_object_type == '3'">
      <span class="partition">被分享者奖励 Referral Reward</span>
      <el-form-item label="奖励类型" prop="recommender_award_type" class="frontLimit">
        <el-select v-model="rewardRulesForm.recommender_award_type" placeholder="请选择奖励类型" clearable>
          <el-option
            v-for="(op, index) in awardTypeOption"
            :key="index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
        <div v-if="rewardRulesForm.recommender_award_type == 1" style="margin-left: 20px;">
          <el-checkbox v-model="rewardRulesForm.recommender_single_coupon_code" label="每人独立Coupon Code"></el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="优惠券名称" prop="recommender_coupon_name">
        <el-input v-model="rewardRulesForm.recommender_coupon_name" clearable></el-input>
      </el-form-item>
      <el-form-item label="游客优惠Code" prop="recommender_tourists_coupon_code">
        <el-input v-model="rewardRulesForm.recommender_tourists_coupon_code" clearable></el-input>
      </el-form-item>
      <el-form-item label="折扣" prop="recommender_discount_value" class="rebates-switch">
        <el-input v-model="rewardRulesForm.recommender_discount_value" clearable></el-input>
        <el-switch
          v-model="rewardRulesForm.recommender_discount_unit"
          active-text="$"
          inactive-text="%"
          active-color="#2B7DE1"
          inactive-color="#2B7DE1"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="订单金额门槛" prop="recommender_order_threshold_amount" class="rebates-switch">
        <el-input v-model="rewardRulesForm.recommender_order_threshold_amount" clearable></el-input>
        <span>$</span>
      </el-form-item>
      <el-form-item label="商品SKU" required class="frontLimit">
        <el-switch v-model="rewardRulesForm.recommender_target_item_limit" prop="recommender_target_item_limit" style="margin-right: 5px;"></el-switch>
        <div :style=" { color: rewardRulesForm.recommender_target_item_limit ? '#2B7DE1' : '#DCDFE6' }">{{ rewardRulesForm.recommender_target_item_limit ? '是' : '否' }}</div>
        <el-form-item v-if="rewardRulesForm.recommender_target_item_limit" prop="productSKU">
          <el-input
            v-model="rewardRulesForm.recommender_award_sku"
            clearable
            style="margin-left: 20px;"
            placeholder="请输入SKU"
          >
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="奖励有效期" prop="sharer_order_date" required>
        <el-date-picker
          v-model="rewardRulesForm.sharer_order_date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { sharerAwardDistributeType, awardObjectType, awardType } from '@/utils/parameters'

export default {
  data() {
    return {
      isAdd: false,
      value1: true,
      awardObjectTypeOption: [],
      awardDistributeTypeOption: [],
      awardTypeOption: [],
      awardCountData: [
        {
          segment_number: '#1',
          award_times_start: '1',
          award_times_end: '3',
          award_times: '',
          award_type: 'Credit',
          award_matching: '固定金额',
          single_award_value: '2'
        },
        {
          segment_number: '#2',
          award_times_start: '4',
          award_times_end: '10',
          award_times: '',
          award_type: 'Credit',
          award_matching: '固定金额',
          single_award_value: '3'
        }
      ],
      addAwardCountData: {
        segment_number: '',
        award_times_start: '',
        award_times_end: '',
        award_type: '',
        award_matching: '',
        single_award_value: ''
      },
      rewardRulesForm: {
        fission_award_object_type: '',
        sharer_award_distribute_type: '',
        recommender_award_type: '',
        recommender_single_coupon_code: '',
        recommender_target_item_limit: false,
        recommender_coupon_name: '',
        recommender_tourists_coupon_code: '',
        recommender_order_threshold_amount: '',
        recommender_discount_unit: '',
        recommender_discount_value: '',
        recommender_award_sku: '',
        sharer_order_date: ''
      },
      rewardRulesRules: {
        fission_award_object_type: [
          { required: true, trigger: 'blur' }
        ],
        sharer_award_distribute_type: [
          { required: true, message: '请选择发放方式', trigger: 'change' }
        ],
        recommender_award_type: [
          { required: true, message: '请选择奖励类型', trigger: 'change' }
        ],
        recommender_single_coupon_code: [
          { required: true, trigger: 'blur' }
        ],
        recommender_target_item_limit: [
          { required: true, trigger: 'blur' }
        ],
        recommender_coupon_name: [
          { required: true, message: '请输入优惠券名字', trigger: 'blur' }
        ],
        recommender_tourists_coupon_code: [
          { required: true, message: '请输入游客优惠Code', trigger: 'blur' }
        ],
        recommender_discount_value: [
          { required: true, message: '请输入折扣', trigger: 'blur' },
          { min: 1, message: '数量不能为0', trigger: 'blur' }
        ],
        recommender_order_threshold_amount: [
          { required: true, message: '请输入订单金额门槛', trigger: 'blur' }
        ],
        recommender_award_sku: [
          { required: true, message: '请输入商品SKU', trigger: 'change' }
        ],
        recommender_order_date: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.awardObjectTypeOption = this.initOptions(awardObjectType)
      this.awardDistributeTypeOption = this.initOptions(sharerAwardDistributeType)
      this.awardTypeOption = this.initOptions(awardType)
    },
    initOptions(El) {
      const outputEL = Object.keys(El).map((key) => {
        const value = El[key]
        return {
          label: value,
          value: key
        }
      })
      return outputEL
    },
    conlog() {
      console.log('rewardRulesForm', this.rewardRulesForm)
    },
    pushData() {
      return this.rewardRulesForm
    },
    getData(data) {
      if (data) {
        console.log('data', data)
        this.rewardRulesForm = {
          fission_award_object_type: data.fission_award_object_type,
          sharer_award_distribute_type: data.sharer_award_distribute_type,
          recommender_award_type: data.recommender_award_type,
          recommender_single_coupon_code: data.recommender_single_coupon_code,
          recommender_target_item_limit: data.recommender_target_item_limit,
          recommender_coupon_name: data.recommender_coupon_name,
          recommender_tourists_coupon_code: data.recommender_tourists_coupon_code,
          recommender_order_threshold_amount: data.recommender_order_threshold_amount,
          recommender_award_sku: data.recommender_award_sku,
          sharer_order_date: [data.recommender_award_effective_time, data.recommender_award_expired_time]
        }
        this.awardCountData = data.sharer_award_rules
        this.awardCountData.award_times = `${this.awardCountData.award_times_start} - ${this.awardCountData.award_times_end}`

        console.log('this.awardCountData', this.awardCountData)
        console.log('this.rewardRulesForm', this.rewardRulesForm)
      }
    },
    deleteRow(index, rows) {
      this.$confirm('确认删除？')
        .then((_) => {
          rows.splice(index, 1)
        })
        .catch((_) => { })
    },
    addAwardCount() {
      this.isAdd = true
      this.addAwardCountData.index = `#${this.awardCountData.length + 1}`
    }
  }
}
</script>
<style lang="scss" scoped>
  .awardCountFooter{
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .rebates-switch{
    position: relative;
    .el-switch{
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%) scale(1.3);
      .el-switch__core{
        display: none;
      }
    }
    span{
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      color: #ADADAD;
    }
  }
</style>
<style lang="scss">
.rebates-switch{
  .el-switch{
    border-radius: 5px;
    overflow: hidden;
    .el-switch__label{
      margin: 0;
      padding: 0 10px;
      color: #ADADAD;
      background-color: transparent;
      &.is-active{
        color: #FFF;
        background-color: #2B7DE1;
      }
    }
    .el-switch__core{
      display: none;
    }
  }
}
</style>

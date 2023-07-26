<template>
  <el-form ref="basicForm" :model="basicForm" :rules="basicRules" label-position="left" label-width="130px" class="demo-Form demo-basicForm">
    <el-form-item label="活动节点" prop="parent_id">
      <el-input v-model="basicForm.parent_id" clearable></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="active_name">
      <el-input v-model="basicForm.active_name" clearable></el-input>
    </el-form-item>
    <el-form-item label="活动类型" prop="active_type">
      <el-select v-model="basicForm.active_type" placeholder="请选择活动类型">
        <el-option label="购后裂变" value="1"></el-option>
        <el-option label="开团" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="活动时区" prop="active_time_zone">
      <el-select
        v-model="basicForm.active_time_zone"
        placeholder="请选择时区"
        clearable
      >
        <el-option
          v-for="(item, key) in timeZoneOptions"
          :key="key"
          :label="item.label"
          :value="item.value"
        >
          {{ item.label }}
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="活动生效时间" prop="activityTime">
      <el-date-picker
        v-model="basicForm.activityTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="活动图片Url" prop="active_image_url">
      <el-input v-model="basicForm.active_image_url" clearable></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      // 枚举所有GMT时区，GMT+H 或GMT-H的格式
      timeZoneOptions: [
        {
          label: 'GMT-12',
          value: 'GMT-12',
          offset: -12
        },
        {
          label: 'GMT-11',
          value: 'GMT-11',
          offset: -11
        },
        {
          label: 'GMT-10',
          value: 'GMT-10',
          offset: -10
        },
        {
          label: 'GMT-9',
          value: 'GMT-9',
          offset: -9
        },
        {
          label: 'GMT-8',
          value: 'GMT-8',
          offset: -8
        },
        {
          label: 'GMT-7',
          value: 'GMT-7',
          offset: -7
        },
        {
          label: 'GMT-6',
          value: 'GMT-6',
          offset: -6
        },
        {
          label: 'GMT-5',
          value: 'GMT-5',
          offset: -5
        },
        {
          label: 'GMT-4',
          value: 'GMT-4',
          offset: -4
        },
        {
          label: 'GMT-3',
          value: 'GMT-3',
          offset: -3
        },
        {
          label: 'GMT-2',
          value: 'GMT-2',
          offset: -2
        },
        {
          label: 'GMT-1',
          value: 'GMT-1',
          offset: -1
        },
        {
          label: 'GMT+0',
          value: 'GMT+0',
          offset: 0
        },
        {
          label: 'GMT+1',
          value: 'GMT+1',
          offset: 1
        },
        {
          label: 'GMT+2',
          value: 'GMT+2',
          offset: 2
        },
        {
          label: 'GMT+3',
          value: 'GMT+3',
          offset: 3
        },
        {
          label: 'GMT+4',
          value: 'GMT+4',
          offset: 4
        },
        {
          label: 'GMT+5',
          value: 'GMT+5',
          offset: 5
        },
        {
          label: 'GMT+6',
          value: 'GMT+6',
          offset: 6
        },
        {
          label: 'GMT+7',
          value: 'GMT+7',
          offset: 7
        },
        {
          label: 'GMT+8',
          value: 'GMT+8',
          offset: 8
        },
        {
          label: 'GMT+9',
          value: 'GMT+9',
          offset: 9
        },
        {
          label: 'GMT+10',
          value: 'GMT+10',
          offset: 10
        },
        {
          label: 'GMT+11',
          value: 'GMT+11',
          offset: 11
        },
        {
          label: 'GMT+12',
          value: 'GMT+12',
          offset: 12
        }
      ],
      basicForm: {
        parent_id: '',
        active_name: '',
        active_image_url: '',
        activityTime: [],
        active_type: ''
      },
      basicRules: {
        parent_id: [
          { required: true, message: '请输入根节点活动', trigger: 'blur' }
        ],
        active_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        active_image_url: [
          { required: true, message: '请输入活动图片链接', trigger: 'blur' }
        ],
        activityTime: [
          { type: 'array', required: true, message: '请选择时间', trigger: 'change' }
        ],
        active_type: [
          { required: true, message: '请选择活动类型', trigger: 'blur' }
        ],
        active_time_zone: [
          { required: true, message: '请选择时区', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    conlog() {
      console.log('basicForm', this.basicForm)
    },
    pushData() {
      return this.basicForm
    },
    getData(data) {
      if (data) {
        this.basicForm = {
          parent_id: data.parent_id,
          active_name: data.active_name,
          activityTime: [data.active_effect_time, data.active_expired_time],
          active_type: data.active_type
        }
      }
    }
  }
}
</script>

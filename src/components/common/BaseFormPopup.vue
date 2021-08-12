<template>
  <div>
    <a-modal
      :title="title"
      :visible="modalVisible"
      :confirm-loading="confirmLoading"
      :mask-closable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item
          v-for="(item,index1) in setting"
          v-show="ifShowItem(item)"
          :key="index1"
          :label="item.label+'： '"
          v-bind="formItemLayout"
        >

          <!-- 多选下拉框 york-->
          <a-select
            v-if="item.type==='multipleSelect'"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required &&[{ required: true, message: `请选择 ${item.label}` }] || []
              }]"

            mode="multiple"
            :placeholder="item.placeholder||'请选择'"
            allow-clear
            :get-popup-container="triggerNode => triggerNode.parentNode"
          >
            <a-select-option
              v-for="(option,index100) in (item.options|| (options && options[item.key]) ||[])"
              :key="index100"
              :value="option.value"
            >{{ option.label }}</a-select-option>
          </a-select>

          <!-- 选择框  -->
          <a-select
            v-if="item.type==='select'"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required &&[{ required: true, message: `请选择 ${item.label}` }] || []
              }]"
            :disabled="item.disabled"
            show-search
            option-filter-prop="children"
            :filter-option="filterOption"
            :placeholder="item.placeholder||'请选择'"
            :get-popup-container="triggerNode => triggerNode.parentNode"
            @change="emitEvent(item.emitName,$event,item)"
          >
            <a-select-option
              v-for="(option,index2) in (item.options|| (options && options[item.key]) ||[])"
              :key="index2"
              :value="option.value"
            >{{ option.label }}</a-select-option>
          </a-select>

          <!-- 选择框 tags模式  -->
          <a-select
            v-if="item.type==='selectTags'"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required &&[{ required: true, message: `请选择 ${item.label}` }] || []
              }]"
            mode="tags"
            :placeholder="item.placeholder||'请选择'"
            allow-clear
            :get-popup-container="triggerNode => triggerNode.parentNode"
          >
            <a-select-option
              v-for="(option,index2) in (item.options|| (options && options[item.key]) ||[])"
              :key="index2"
              :value="option.value"
            >{{ option.label }}</a-select-option>
          </a-select>
          <!-- 联级选择器 -->
          <a-cascader
            v-else-if="item.type==='cascader'"
            v-decorator="[
              item.key, { initialValue: initialValues[item.key], rules: item.required &&[{ required: true, message: `请选择 ${item.label}` }] || []}]"
            :options="options[item.key]"
            :get-popup-container="triggerNode => triggerNode.parentNode"
            placeholder="Please select"
          />
          <!-- 上传单张图片 -->
          <a-upload
            v-else-if="item.type==='uploadImg'"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required && [{ required: true, message: `请上传图片` }] || []
              }]"
            list-type="picture"
            class="upload-list-inline"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            :custom-request="customRequest"
          >
            <a-button v-if="fileList.length<1">
              <a-icon type="upload" />上传图片
            </a-button>
          </a-upload>

          <!-- 开始时间 -  required -->
          <a-date-picker
            v-else-if="item.type==='dateBegin'"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required && [{ type: 'object', required: true, message: `请选择 ${item.label}` }] || []
              }]"
            allow-clear
            :get-calendar-container="triggerNode => triggerNode.parentNode"
          />

          <!-- 起止时间 -->
          <a-range-picker
            v-else-if="item.type==='daterange'&& item.required"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required && [{ type: 'array', required: true, message: `请选择 ${item.label}` }] || []
              }]"
            allow-clear
          />

          <!-- 单选 -->
          <a-radio-group
            v-else-if="item.type==='radioGroup'"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required && [{ required: true, message: `请选择 ${item.label}` }] || []
              }]"
            :name="item.key"
            :options="item.options || (options && options[item.key]) || []"
          />

          <!-- 输入框 -->
          <a-input
            v-else-if="item.type==='input'"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required && [
                  {
                    required: true,
                    message: `请输入 ${item.label}`,
                    pattern: item.regExp || null ,
                    type: 'string',
                    transform:function(value){ if(!value) { return ''}else {return value }}},
                  item.max && { max: item.max , message: `${item.label}的长度应该不大于 ${item.max}`} ||{},
                  item.min && { min: item.min , message: `${item.label}的长度应该不小于 ${item.min}`} ||{}
                ] || []
              }]"
            :disabled="item.disabled"
            :placeholder="item.placeholder||''"
            :addon-before="item.addonBefore"
            :addon-after="item.addonAfter"
            :min="item.min"
            allow-clear
            @input="inputWarn"
          />

          <!-- 数字输入框 -->
          <a-input-number
            v-else-if="item.type==='numberInput'"
            v-decorator="item.required && [
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required && [
                  { required: true, message: `请输入 ${item.label}` }] ||[]
              }]"
            :placeholder="item.placeholder||''"
            :addon-before="item.addonBefore"
            :addon-after="item.addonAfter"
            style="width:100%"
            allow-clear
          />

          <!-- 文本域 -->
          <!-- <div v-else-if="item.type==='textarea'">{{ initialValues[item.key] }}</div> -->
          <a-textarea
            v-else-if="item.type==='textarea'"
            v-decorator="[
              item.key,
              { initialValue: initialValues[item.key],
                rules: item.required && [
                  { required: true, message: `请输入 ${item.label}`,transform:function(value){if(!value) { return ''}else {return value}} },
                  item.max && { max: item.max , message: `${item.label}的长度应该不大于 ${item.max}`} ||{},
                  item.min && { min:item.min , message: `${item.label}的长度应该不小于 ${item.min}`} ||{}
                ] || []
              }]"
            :placeholder="item.placeholder||''"
            :rows="item.rows||4"
            :min="item.min"
            class="form-popup-text-area"
          />

          <!-- 谷歌验证 -->
          <!-- <GoogleAuthNumber
            v-else-if="item.type==='googleAuth'"
            :googleAuth="initialValues['googleAuth']"
          /> -->
          <!-- solt -->
          <div v-else-if="item.type==='slotName'&&item.slotName">
            <slot
              :name="item.slotName"
              :text="initialValues[item.key]"
              :record="initialValues"
              :index="index1"
            />
          </div>
          <!-- 直接显示值 -->
          <span v-else>{{ initialValues[item.key] }}</span>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
// https://github.com/yiminghe/async-validator#deep-rules   校验规则
// import GoogleAuthNumber from './googleAuthNumber'
// import { uoloadLogo } from '@/api/systemSetting'

export default {
  components: {
    // GoogleAuthNumber
  },
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: null
    },
    setting: {
      type: Array,
      default: null
    },
    formValue: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      initialValues: {}, // 表单数据
      defaultValueForm: {}, // 默认值数据
      modalVisible: false,
      confirmLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      }
    }
  },
  //  必须是 required 才可以 同步
  watch: {
    visible(val) {
      if (val) {
        this.confirmLoading = false
        this.initialValues = Object.assign({}, this.defaultValueForm, this.formValue)
        this.initialValues = Object.assign({}, this.formValue)
        this.form = this.$form.createForm(this, { name: 'baseFormPopup' })
      }
      if (this.formValue.logo) {
        this.fileList = [{ uid: '-1', name: 'logo', status: 'done', url: this.formValue.logo }]
      } else if (this.formValue.pic_path) {
        this.fileList = [{ uid: '-1', name: 'pic_path', status: 'done', url: this.formValue.pic_path }]
      } else {
        this.fileList = []
      }
      this.modalVisible = val
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'baseFormPopup' })
  },
  created() {
    this.setting.forEach(item => {
      if (item.defaultValue !== undefined) {
        this.defaultValueForm[item.key] = item.defaultValue
      }
    })
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    emitEvent(eventName, v, item) {
      if (!eventName) {
        return
      }
      this.$emit(eventName, v, item.options)
    },
    // 上传相关
    // customRequest (file) {
    //   var formdata = new FormData()
    //   formdata.append('img', file.file)
    //   uoloadLogo(formdata).then(res => {
    //     this.fileList = [ { uid: '-1', name: file.file.name, status: 'done', url: res.data } ]
    //   })
    // },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.url
        }
        return file
      })
      this.fileList = fileList
    },
    beforeUpload(file) {
      const isImage = file.type.indexOf('image') > -1
      if (!isImage) {
        this.$message.error('请上传图片文件！')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片文件必须小于 2MB！')
        return false
      }
      this.fileList = [...this.fileList, file]
    },
    // 根据相关的值，隐藏或显示 表单项
    ifShowItem(item) {
      if (!item.relationKey) {
        return true
      }
      if (this.form[item.relationKey] !== item.relationShowValue) {
        return false
      }
      return true
    },
    handleOk() {
      // this.confirmLoading = false

      this.form.validateFields((err, values) => {
        if (err) {
          this.confirmLoading = false
          return
        }
        const form = Object.assign({}, values)
        if (this.fileList.length !== 0) {
          form['uploadFileList'] = this.fileList
        }
        this.$emit('ok', form)
        this.form.resetFields()
      })
    },
    handleCancel() {
      this.$emit('close')
      this.confirmLoading = false
    },
    inputWarn() {
    }
  }

}
</script>

<style lang="less">
#baseFormPopup_parent_key + span {
  display: none;
}
.ant-select + span {
  display: none;
}
</style>

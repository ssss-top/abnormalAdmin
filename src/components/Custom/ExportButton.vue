<template>
  <a-button :loading="loading === 1" icon="download" @click="exportExcel">导出</a-button>
</template>
<script>
export default {
  name: 'ExportButton',
  props: {
    url: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    },
    fileName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: 0
    }
  },
  methods: {
    exportExcel() {
      if (this.loading === 1) return
      this.loading = 1
      const params = {
        export: 1
      }
      Object.assign(params, this.params)
      this.axios({
        url: this.url,
        method: 'get',
        params,
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          this.loading = 2
          console.log('exportExcel.res', res)
          this.handleExportFile(res, this.fileName)
        })
        .catch(err => {
          this.loading = 2
          console.log('exportExcel.err', err)
        })
    },
    // 从接口收到导出数据后，处理
    handleExportFile(res, name) {
      if (!res || !res.headers) {
        this.$message.error('导出失败')
        console.log('导出失败', res)
        return
      }
      const link = document.createElement('a')
      link.style.display = 'none'
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      link.href = URL.createObjectURL(blob)
      const disposition = res.headers['content-disposition'] || ''
      let fileName = (disposition.split('filename=') || [])[1]
      fileName = name || '导出表格'
      fileName = fileName + '.csv'
      link.download = decodeURI(fileName) || '导出文件'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

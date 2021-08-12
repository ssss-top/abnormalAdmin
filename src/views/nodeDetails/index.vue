<template>
  <div class="node">
    <div class="node-bar">
      <h2>
        <a-icon type="user" />
        <span style="margin-left:15px">{{ minerid }}</span>
      </h2>
      <a-menu
        :default-selected-keys="[mode]"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
        @click="switchTab"
      >
        <a-menu-item v-for="item in menuList" :key="item.key">
          <a-icon :type="item.icon" />
          <span>{{ item.title }}</span>
        </a-menu-item>
        <a-menu-item key="0" @click="outDeatils">
          <a-icon type="logout" />
          <span>退出详情</span>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="node-content">
      <!-- 表格数据过滤器 -->
      <a-card style="min-width: 100%" :bordered="false">
        <node-detail v-if="mode === '1'" :minerid="minerid" title="节点详情" />
        <workerPower v-if="mode === '2'" :minerid="minerid" title="机器算力" />
        <workerList v-if="mode === '3'" :minerid="minerid" title="任务列表" />
        <deadline v-if="mode === '4'" :minerid="minerid" title="Deadline" />
        <minerSectors v-if="mode === '5'" :minerid="minerid" title="扇区列表" />
        <migrateTasks v-if="mode === '6'" :minerid="minerid" title="迁移任务" />
        <storeMachines v-if="mode === '7'" :minerid="minerid" title="存储机列表" />
        <restoreTasks v-if="mode === '8'" :minerid="minerid" title="恢复任务" />
      </a-card>
    </div>
  </div>
</template>
<script>
import NodeDetail from './components/nodeDetail'
import workerPower from './components/workerPower'
import workerList from './components/workerList'
import deadline from './components/deadline'
import minerSectors from './components/minerSectors'
import migrateTasks from './components/migrateTasks'
import storeMachines from './components/storeMachines'
import restoreTasks from './components/restoreTasks'
export default {
  components: {
    workerPower,
    workerList,
    deadline,
    minerSectors,
    migrateTasks,
    storeMachines,
    restoreTasks,
    NodeDetail
  },
  data() {
    return {
      minerid: '',
      mode: '1',
      collapsed: false,
      num: 0,
      menuList: [
        {
          key: '1',
          icon: 'global',
          title: '节点详情'
        },
        {
          key: '2',
          icon: 'desktop',
          title: '机器算力'
        },
        {
          key: '3',
          icon: 'file-done',
          title: '任务列表'
        },
        {
          key: '4',
          icon: 'cloud-server',
          title: 'Deadline'
        },
        {
          key: '5',
          icon: 'pie-chart',
          title: '扇区列表'
        },
        {
          key: '6',
          icon: 'copy',
          title: '迁移任务'
        },
        {
          key: '7',
          icon: 'database',
          title: '存储机列表'
        },
        {
          key: '8',
          icon: 'file-protect',
          title: '恢复任务'
        }
      ]

    }
  },

  created() {
    this.minerid = this.$route.query.minerid
    // 判断改页面是首次加载还是刷新
    if (window.performance.navigation.type === 1) {
      // console.log('页面被刷新！')
      if (localStorage.mode) {
        this.mode = localStorage.mode
      }
    } else {
      // console.log('首次被加载！')
      this.mode = '1'
    }

    // }

    // this.init()

    if (!this.minerid) {
      return false
    }
    document.title = this.minerid + '-' + this.menuList[this.mode - 1].title
  },
  mounted() {

  },
  // created() {
  //   this.init()
  // },
  methods: {

    outDeatils() {
      console.log('5454545544554')
    },
    // 切换菜单
    switchTab(e) {
      this.mode = e.key
      if (this.mode === '0') {
        this.$router.push('/sealingState')
        return false
      }

      this.title = this.menuList[this.mode - 1].title
      document.title = this.minerid + '-' + this.title

      localStorage.mode = this.mode
    }
  }
}
</script>
<style lang="less">
.title{
    background-color: #fff;
    font-size: 20px;
    padding: 10px ;
  }
.node{
  display: flex;
  min-height: 100%;
  width: 100%;
  .node-bar{
    min-width: 256px;
    background-color: #001529;

    h2{
      padding:10px 24px;
      color: #fff;
      margin: 0;
    }
  }
  .node-content{
    width: 100%;
  }

}
  .card-list {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    flex-wrap: wrap;
    .node-detail {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      ::after {
        display: none;
      }
      .detail-item {
        min-width: 48%;
      }
    }
  }
</style>

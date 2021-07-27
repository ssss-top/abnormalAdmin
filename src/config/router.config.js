// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '管理后台' },
    redirect: '/MonitorLog',
    children: [
      // bzz盒子列表
      {
        path: '/MonitorLog',
        name: 'clusters',
        // redirect: '/dashboard/home',
        // component: RouteView,
        component: () => import('@/views/MonitorLog'),
        meta: { title: '监控日志', keepAlive: true, icon: 'database', permission: ['dashboard'] }
      },
      // 会员管理
      {
        path: '/issuesList',
        name: 'issuesList',
        // redirect: '/dashboard/home',
        // component: RouteView,
        component: () => import('@/views/issuesList'),
        meta: { title: '硬件问题列表', keepAlive: true, icon: 'alert', permission: ['dashboard'] }
      },
      // 会员管理
      {
        path: '/hardware',
        redirect: '/hardware/list',
        component: RouteView,
        meta: { title: '硬件管理', icon: 'solution', permission: ['form'] },
        children: [
          {
            path: '/hardware/list',
            name: 'hardware_list',
            component: () => import('@/views/hardware/list'),
            meta: { title: '硬件管理', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/hardware/cloud',
            name: 'hardware_cloud',
            component: () => import('@/views/hardware/cloud'),
            meta: { title: '云硬件管理', keepAlive: true, permission: ['form'] }
          }
        ]
      },
      // 矿工列表
      {
        path: '/minerList',
        name: 'minerList',
        // redirect: '/dashboard/home',
        // component: RouteView,
        component: () => import('@/views/minerList'),
        meta: { title: '矿工列表', keepAlive: true, icon: 'contacts', permission: ['dashboard'] }
      },
      // 证明Deadline列表
      {
        path: '/wdpostDeadlines',
        name: 'wdpostDeadlines',
        component: () => import('@/views/wdpostDeadlines'),
        hidden: true,
        meta: { title: '证明Deadline列表', keepAlive: false, icon: 'solution', permission: ['dashboard'] }
      },
      // 爆块日志列表
      {
        path: '/blockMininglog',
        name: 'blockMininglog',
        component: () => import('@/views/blockMininglog'),
        hidden: true,
        meta: { title: '爆块日志列表', keepAlive: false, icon: 'solution', permission: ['dashboard'] }
      },
      // 程序进程列表
      {
        path: '/procedureCourse',
        name: 'procedureCourse',
        component: () => import('@/views/procedureCourse'),
        hidden: true,
        meta: { title: '程序进程列表', keepAlive: false, icon: 'solution', permission: ['dashboard'] }
      },
      // 密封列表
      {
        path: '/sealingState',
        name: 'sealingState',
        component: () => import('@/views/sealingState'),
        meta: { title: '密封列表', keepAlive: false, icon: 'file-zip', permission: ['dashboard'] }
      },
      // 节点详情
      {
        path: '/machine',
        name: 'machine',
        component: () => import('@/views/machine/index'),
        hidden: true,
        meta: { title: '节点详情' }
      },
      // 机器扇区列表
      // {
      //   path: '/workerSectors',
      //   name: 'workerSectors',
      //   component: () => import('@/views/workerSectors'),
      //   hidden: true,
      //   meta: { title: '机器扇区列表' }
      // },
      // 爆块回溯列表
      {
        path: '/blastRecallList',
        name: 'blastRecallList',
        component: () => import('@/views/blastRecallList'),
        meta: { title: '爆块回溯列表', keepAlive: false, icon: 'to-top', permission: ['dashboard'] }
      },
      // 爆块回溯列表
      {
        path: '/lotusList',
        name: 'lotusList',
        component: () => import('@/views/lotusList'),
        meta: { title: 'Lotus信息列表', keepAlive: false, icon: 'usergroup-add', permission: ['dashboard'] }
      },
      {
        path: '/migrationTask',
        name: 'migrationTask',
        component: () => import('@/views/migrationTask'),
        meta: { title: '迁移任务列表', keepAlive: false, icon: 'branches', permission: ['dashboard'] }
      },
      {
        path: '/storeMachine',
        name: 'storeMachine',
        component: () => import('@/views/storeMachine'),
        meta: { title: '存储机列表', keepAlive: false, icon: 'branches', permission: ['dashboard'] }
      }

      // 挖矿管理
      // {
      //   path: '/mining',
      //   name: 'mining',
      //   component: RouteView,
      //   redirect: '/mining/computingPowerOutput',
      //   meta: { title: '挖矿管理', icon: 'gold', permission: ['table'] },
      //   children: [
      //     {
      //       path: '/mining/computingPowerOutput',
      //       name: 'mining_computing_power_output',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       component: () => import('@/views/mining/computingPowerOutput'),
      //       meta: { title: '算力产出管理', keepAlive: true, permission: ['table'] }
      //     },
      //     {
      //       path: '/mining/memberIncome',
      //       name: 'mining_member_income',
      //       component: () => import('@/views/mining/memberIncome'),
      //       meta: { title: '用户收益记录', keepAlive: true, permission: ['table'] }
      //     },
      //     {
      //       path: '/mining/release',
      //       name: 'mining_release',
      //       component: () => import('@/views/mining/release'),
      //       meta: { title: '释放记录', keepAlive: true, permission: ['table'] }
      //     },
      //     {
      //       path: '/mining/computingPowerIncome',
      //       name: 'mining_computing_power_income',
      //       component: () => import('@/views/mining/computingPowerIncome'),
      //       meta: { title: '算力收益明细', keepAlive: true, permission: ['table'] }
      //     },
      //     {
      //       path: '/mining/settings',
      //       name: 'mining_settings',
      //       component: () => import('@/views/mining/settings'),
      //       meta: { title: '参数设置', keepAlive: true, permission: ['table'] }
      //     }
      //   ]
      // },
      // 资产管理
      // {
      //   path: '/assets',
      //   name: 'assets',
      //   component: RouteView,
      //   redirect: '/assets/withdrawCoin',
      //   meta: { title: '资产管理', icon: 'dollar', permission: ['profile'] },
      //   children: [
      //     {
      //       path: '/assets/withdrawCoin',
      //       name: '提币记录',
      //       component: () => import('@/views/assets/withdrawCoin'),
      //       meta: { title: '提币记录', permission: ['profile'] }
      //     }
      //   ]
      // },
      // 权限管理
      // {
      //   path: '/permissions',
      //   name: 'permissions',
      //   component: RouteView,
      //   redirect: '/permissions/account',
      //   meta: { title: '权限管理', icon: 'lock', permission: ['result'] },
      //   children: [
      //     {
      //       path: '/permissions/account',
      //       name: 'permissions_account',
      //       component: () => import('@/views/permissions/account'),
      //       meta: { title: '帐户管理', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
      //     },
      //     {
      //       path: '/permissions/roles',
      //       name: 'permissions_roles',
      //       component: () => import('@/views/permissions/roles'),
      //       meta: { title: '角色管理', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
      //     },
      //     {
      //       path: '/permissions/manage',
      //       name: 'permissions_manage',
      //       component: () => import('@/views/permissions/manage'),
      //       meta: { title: '权限管理', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
      //     }
      //   ]
      // }

    ]
  },
  {
    path: '*',
    redirect: '/clusters',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  // 帐号登录、注册
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/Login')
      },
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/Register')
      // },
      // {
      //   path: 'register-result',
      //   name: 'registerResult',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      // },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  // Exception
  {
    path: '/exception',
    name: 'exception',
    component: RouteView,
    hidden: true,
    redirect: '/exception/403',
    meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
    children: [
      {
        path: '/exception/403',
        name: 'Exception403',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
        meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
      },
      {
        path: '/exception/404',
        name: 'Exception404',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
        meta: { title: 'menu.exception.not-find', permission: ['exception'] }
      },
      {
        path: '/exception/500',
        name: 'Exception500',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
        meta: { title: 'menu.exception.server-error', permission: ['exception'] }
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

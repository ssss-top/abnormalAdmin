import { UserLayout, BasicLayout } from '@/layouts'

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
      {
        path: '/MonitorLog',
        name: 'MonitorLog',
        component: () => import('@/views/MonitorLog'),
        meta: { title: '监控日志', keepAlive: true, icon: 'database' }
      },
      {
        path: '/issuesList',
        name: 'issuesList',
        component: () => import('@/views/issuesList'),
        meta: { title: '硬件问题列表', keepAlive: true, icon: 'alert' }
      },
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
      {
        path: '/minerList',
        name: 'minerList',
        component: () => import('@/views/minerList'),
        meta: { title: '矿工列表', keepAlive: true, icon: 'contacts', permission: ['dashboard'] }
      },
      {
        path: '/wdpostDeadlines',
        name: 'wdpostDeadlines',
        component: () => import('@/views/wdpostDeadlines'),
        hidden: true,
        meta: { title: '证明Deadline列表', keepAlive: true, icon: 'solution', permission: ['dashboard'] }
      },
      {
        path: '/blockMininglog',
        name: 'blockMininglog',
        component: () => import('@/views/blockMininglog'),
        hidden: true,
        meta: { title: '爆块日志列表', keepAlive: true, icon: 'solution', permission: ['dashboard'] }
      },
      {
        path: '/procedureCourse',
        name: 'procedureCourse',
        component: () => import('@/views/procedureCourse'),
        hidden: true,
        meta: { title: '程序进程列表', keepAlive: true, icon: 'solution', permission: ['dashboard'] }
      },
      {
        path: '/sealingState',
        name: 'sealingState',
        component: () => import('@/views/sealingState'),
        meta: { title: '密封列表', keepAlive: true, icon: 'file-zip', permission: ['dashboard'] }
      },
      {
        path: '/machine',
        name: 'machine',
        component: () => import('@/views/machine/index'),
        hidden: true,
        meta: { title: '节点详情', keepAlive: true }
      },
      {
        path: '/machine/machine',
        name: 'machine',
        component: () => import('@/views/machine/machine'),
        hidden: true,
        meta: { title: '节点详情', keepAlive: true }
      },
      {
        path: '/blastRecallList',
        name: 'blastRecallList',
        component: () => import('@/views/blastRecallList'),
        meta: { title: '爆块回溯列表', keepAlive: true, icon: 'to-top', permission: ['dashboard'] }
      },
      {
        path: '/lotusList',
        name: 'lotusList',
        component: () => import('@/views/lotusList'),
        meta: { title: 'Lotus信息列表', keepAlive: true, icon: 'usergroup-add', permission: ['dashboard'] }
      },
      {
        path: '/luckyBoxPlot',
        name: 'luckyBoxPlot',
        component: () => import('@/views/luckyBoxPlot'),
        meta: { title: '全网幸运值分布', keepAlive: true, icon: 'area-chart', permission: ['dashboard'] }
      }

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
      },
      {
        path: '/nodeDetails',
        component: () => import('@/views/nodeDetails/index'),
        hideChildrenInMenu: true,
        hidden: true,
        meta: { title: '节点详情', keepAlive: true, icon: 'area-chart', permission: ['dashboard'] }
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

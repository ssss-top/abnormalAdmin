import request from '@/utils/request'

const userApi = {
  Login: '/v1/user/login',
  Logout: '/au/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return request({
    url: '/v1/user/login',
    method: 'post',
    data: parameter
  })
}
// 盒子列表
export function BoxClientList(parameter, pageindex) {
  const urlStr = JsonToUrl(parameter)
  return request({
    url: `bc/box/client/list/${pageindex}/?${urlStr}`,
    method: 'get'
  })
}
// 执行脚本
export function bseJobsSubmit(parameter) {
  return request({
    url: 'bse/jobs/submit',
    method: 'post',
    data: parameter
  })
}
// 脚本任务列表
export function bseJobsList(parameter, pageindex) {
  const urlStr = JsonToUrl(parameter)
  return request({
    url: `bse/job/list/${pageindex}/?${urlStr}`,
    method: 'get'
  })
}
// 盒子任务列表
export function bseJobItemList(parameter, pageindex) {
  const urlStr = JsonToUrl(parameter)
  return request({
    url: `bse/job/item/list/${pageindex}/?${urlStr}`,
    method: 'get'
  })
}
// 退出
export function logout() {
  return request({
    url: '/au/logout',
    method: 'post'
  })
}

export function getSmsCaptcha(parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

// 获取监控日志
export function alarmlogs(parameter, clusters) {
  const urlStr = JsonToUrl(parameter)
  return request({
    url: `/v1/alarmlogs?cluster=${clusters}&&${urlStr}`,
    method: 'get'
  })
}

// 获取硬件集群
export function clusters() {
  // const urlStr = JsonToUrl(parameter)
  return request({
    url: `/v1/clusters`,
    method: 'get'
  })
}

// 机器类型列表
export function hardwareIssueType() {
  // const urlStr = JsonToUrl(parameter)
  return request({
    url: `/v1/hardware_issue_type`,
    method: 'get'
  })
}

// 获取硬件问题记录/v1/hardware_issues
export function hardwareIssues(parameter, clusters) {
  const urlStr = JsonToUrl(parameter)
  return request({
    url: `/v1/hardware_issues?cluster=${clusters}&&${urlStr}`,
    method: 'get'
  })
}

// 状态列表 v1/alarmlog_type
export function alarmlogType() {
  return request({
    url: `/v1/alarmlog_type`,
    method: 'get'
  })
}
// 修改状态 v1/set_hardware_issue_status
export function setHardwareIssueSstatus(parameter) {
  return request({
    url: `/v1/set_hardware_issue_status`,
    method: 'post',
    data: parameter
  })
}
// 修改除状态外的其他信息
export function setHardwareIssue(parameter, val) {
  let url = ''
  if (!val) {
    url = 'val'
  } else {
    url = val
  }
  return request({
    url: url,
    method: 'post',
    data: parameter
  })
}

// 机器管理列表
export function machines(parameter) {
  const urlStr = JsonToUrl(parameter)
  return request({
    url: `/v1/machines?${urlStr}`,
    method: 'get'
  })
}

// 机器迁移machines_migration
export function machinesMigration(parameter) {
  return request({
    url: `/v1/machines_migration`,
    method: 'post',
    data: parameter
  })
}
export function getInfo() {
  // return request({
  //   url: 'v1/admin/login',
  //   method: 'get',
  //   headers: {
  //     'Content-Type': 'application/json;charset=UTF-8'
  //   }
  // })
  return new Promise((resolve, reject) => {
    resolve({
      result: {
        'id': '4291d7da9005377ec9aec4a71ea837f',
        'name': '天野远子',
        'username': 'admin',
        'password': '',
        'avatar': '/avatar2.jpg',
        'status': 1,
        'telephone': '',
        'lastLoginIp': '27.154.74.117',
        'lastLoginTime': 1534837621348,
        'creatorId': 'admin',
        'createTime': 1497160610259,
        'merchantCode': 'TLif2btpzg079h15bk',
        'deleted': 0,
        'roleId': 'admin',
        'role': {
          'id': 'admin',
          'name': '管理员',
          'describe': '拥有所有权限',
          'status': 1,
          'creatorId': 'system',
          'createTime': 1497160610259,
          'deleted': 0,
          'permissions': [{
            'roleId': 'admin',
            'permissionId': 'dashboard',
            'permissionName': '仪表盘',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'query',
              'describe': '查询',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'exception',
            'permissionName': '异常页面权限',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'query',
              'describe': '查询',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'result',
            'permissionName': '结果权限',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'query',
              'describe': '查询',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'profile',
            'permissionName': '详细页权限',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'query',
              'describe': '查询',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'table',
            'permissionName': '表格权限',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'import',
              'describe': '导入',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'form',
            'permissionName': '表单权限',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'query',
              'describe': '查询',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'order',
            'permissionName': '订单管理',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'query',
              'describe': '查询',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'permission',
            'permissionName': '权限管理',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'role',
            'permissionName': '角色管理',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'table',
            'permissionName': '桌子管理',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'query',
              'describe': '查询',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }, {
            'roleId': 'admin',
            'permissionId': 'user',
            'permissionName': '用户管理',
            'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
            'actionEntitySet': [{
              'action': 'add',
              'describe': '新增',
              'defaultCheck': false
            }, {
              'action': 'import',
              'describe': '导入',
              'defaultCheck': false
            }, {
              'action': 'get',
              'describe': '详情',
              'defaultCheck': false
            }, {
              'action': 'update',
              'describe': '修改',
              'defaultCheck': false
            }, {
              'action': 'delete',
              'describe': '删除',
              'defaultCheck': false
            }, {
              'action': 'export',
              'describe': '导出',
              'defaultCheck': false
            }],
            'actionList': null,
            'dataAccess': null
          }]
        }
      }
    })
  })
}

export function getCurrentUserNav() {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step(parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}

function JsonToUrl(data) {
  var tempArr = []
  for (var i in data) {
    var key = encodeURIComponent(i)
    var value = encodeURIComponent(data[i])
    if (data[i] || data[i] === 0) {
      tempArr.push(key + '=' + value)
    }
  }
  var urlParamsStr = tempArr.join('&')
  return urlParamsStr
}

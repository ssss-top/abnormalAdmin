// 提币状态
export const WITHDRAW_STATUS = {
  '-2': '已拒绝',
  '0': '等待审核',
  '1': '提币中',
  '2': '提币完成',
  '3': '提币失败',
  '4': '待确认'
}

// 提币分类
export const WITHDRAW_TYPE = {
  '1': '站内',
  '2': '站外',
  '3': '雾节点'
}

// 提币的审核状态
export const WITHDRAW_CHECK_STATUS = {
  'begin': '发起提币',
  'processing': '处理中',
  'reject': '拒绝提币',
  'completed': '提币完成'
}

// 充币状态
export const RECHARGE_STATUS = {
  '1': '正常',
  '2': '小于最小充币数',
  '3': '充币功能已关闭',
  '4': '链与币的关系已解除',
  '5': '币与链未建立关系'
}

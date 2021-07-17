// （0|正|负）整数
export const int = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/
// 正（整|小）数
export const float = /^(0|([1-9]\d*))(\.\d+)?$/
// 手机号
export const cellphone = /^[1][3,4,5,7,8][0-9]{9}$/
export default {
  int,
  float,
  cellphone
}

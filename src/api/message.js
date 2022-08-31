import ajax from './ajax'
// 获取消息通知
export const getMsg = _id => ajax('/msg/getMsg', { _id })
// 删除消息通知
export const deleteMsg = (_id, userId) => ajax('/msg/deleteMsg', { _id, userId })

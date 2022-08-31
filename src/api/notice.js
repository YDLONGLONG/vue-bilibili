import ajax from './ajax'
// 获取系统通知
export const getNotice = () => ajax('/notice/get')

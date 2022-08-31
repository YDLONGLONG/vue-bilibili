//举报
import ajax from './ajax'
//新增举报
export const addBan = data => ajax('/ban/addBan', data , 'post')

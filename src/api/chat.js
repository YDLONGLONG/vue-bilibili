//一对一聊天相关
import ajax from './ajax'
//获取一对一消息
export const getChat = data => ajax('/chat/getChat', data)
//保存一对一消息
export const addChat = data => ajax('/chat/addChat', data , 'post')
//汇总一对一消息未读数
export const getunread = userid => ajax('/chat/getunread', {userid})
//一对一消息状态修改
export const setunread = data => ajax('/chat/setunread', data , 'post')
//删除指定消息
export const deleteOneChat = _id => ajax('/chat/deleteOneChat', _id , 'post')
//获取未读消息人数列表
export const getunreadList = userid => ajax('/chat/getunreadlist', {userid})
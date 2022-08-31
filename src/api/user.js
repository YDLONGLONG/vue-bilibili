//用户相关
import ajax from './ajax'
//发送邮件
export const sendEmail = email => ajax('/user/sendEmail', { email }, 'post')
//  注册
export const reg = data => ajax('/user/reg', data, 'post')
//  登录
export const login = data => ajax('/user/login', data, 'post')
//  邮箱验证码登录
export const codelogin = data => ajax('/user/codelogin', data, 'post')
//  手机号验证码登录
export const phonelogin = data => ajax('/user/phonelogin', data, 'post')
//  判断是否登录
export const isLogin = () => ajax('/user/isLogin')
//  退出登录
export const logout = () => ajax('/user/logout')
//  获取用户头像
export const getUserHeadUrl = _id => ajax('/user/headUrl', { _id })
//获取用户基本信息
export const getUserById = _id => ajax('/user/id', { _id })
// 修改用户信息
export const updateUser = data => ajax('/user/update', data, 'post')
//获取用户收藏
export const getCollection = (_id, page) => ajax('/user/collection', { _id, page })
// 获取用户邮箱
export const getEmail = _id => ajax('/user/email', { _id })
// 获取用户手机号
export const getPhone = _id => ajax('/user/phone', { _id })
//修改密码
export const updatePass = data => ajax('/user/password', data, 'post')
//获取关注列表
export const getAttentionList = _id => ajax('/user/attentionList', { _id })
//获取关注列表用户信息
export const getAttentionUser = _id => ajax('/user/attention', { _id })
//切换关注
export const toggleAtt = data => ajax('/user/togAtt', data, 'post')
//获取用户详情信息
export const getUserInfo = userid => ajax('/user/info', {userid})
//修改用户详情信息
export const updateUserInfo = data => ajax('/user/info', data, 'post')
//查询用户
export const searchUser = keyWord => ajax('/video/searchuser', {keyWord})
//增加观看历史记录
export const addHistory = data => ajax('/user/history', data, 'post')
//绑定邮箱
export const bindEmail = data => ajax('/user/bindEmail', data, 'post')
//绑定手机号
export const bindPhone= data => ajax('/user/bindPhone', data, 'post')
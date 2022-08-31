import ajax from './ajax'

// 发表动态
export const sendTrend= data => ajax('/trend/sendtrend', data, 'post')
// 删除
export const deleteTrend = data => ajax('/trend/deletetrend', data, 'post')
// 获取全部动态
export const getTrendPage = (author, page = 1)=> ajax('/trend/trendpage', {author, page})
// 获取单个动态详情
export const getTrendInfo = _id => ajax('/trend/trendinfo', {_id})
//赞
export const zan = data => ajax('/trend/zan', data, 'post')

// 发表评论
export const sendComment = data => ajax('/trend/sendcomment', data, 'post')
// 获取评论
export const getCommentPage = (_id, page = 1) => ajax('/trend/commentpage', { _id, page })
// 回复评论
export const replyComment = data => ajax('/trend/replycomment', data, 'post')
// 删除评论
export const deleteComment = data => ajax('/trend/delete', data, 'post')

//查询动态
export const searchTrend = keyWord => ajax('/video/searchtrend', {keyWord})
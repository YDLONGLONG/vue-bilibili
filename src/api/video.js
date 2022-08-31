//视频相关
import ajax from './ajax'
//  上传视频
export const uploadVideo = data => ajax('/upload/video', data, 'post')
//轮播图推荐
export const recommend = () => ajax('/video/hot')
//分页查询
export const getVideoPage = (page = 1, type = '') => ajax('/video/page', { page, type })
//根据_id查询
export const getVideoById = _id => ajax(`/video/byId`, { _id })
//获取弹幕 限制最多
export const getDanmu = player => ajax('/danmu', { player })
//发送弹幕
export const sendDanmu = data => ajax('/danmu', data, 'post')
//播放次数++
export const setPlayCount = _id => ajax('/video/play', { _id })
//排行榜
export const top = () => ajax('/video/top')
//赞
export const zan = data => ajax('/video/zan', data, 'post')
//收藏
export const collect = data => ajax('/video/collect', data, 'post')
//搜索
export const search = (keyWord, page, sortBy) => ajax('/video/search', { keyWord, page, sortBy })
//获取用户上传的视频
export const getVideoPageByUser = data => ajax('/video/userId', data)
//删除视频
export const deleteVideoById = _id => ajax('/video/delete', { _id }, 'post')
//修改视频详情
export const updateVideoInfo = data => ajax('/video/editInfo', data, 'post')
//换一换
export const getRandomVideoPage = (page = 1) => ajax('/video/random', page)

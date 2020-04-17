import request from './index';

/**
 *  GET请求  数据放在 params 属性内
 *  POST请求 数据放在 data   属性内
 * */

/**
 * 1、查任务内容
id	是	string	任务唯一标识
 * */
export function ajaxTaskContent(options) {
  return request({
    url: '/task/taskContent',
    method: 'get',
    params: options
  });
}

/**
 * 2、投票
 * 参数名	是否必须	类型	说明
kind	是	string	资源类型 5:投票选项
name	否	string	资源名
taskId	是	string	任务ID
content	是	string	资源内容
selectedOptions	是	JSONArray	投票选项
realNameValue	否	String	投票者姓名
 * */
export function ajaxVote(options) {
  return request({
    url: '/resource/uploadVote',
    method: 'post',
    data: options
  });
}

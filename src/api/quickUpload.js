import request from './index';

/**
 *  GET请求  数据放在 params 属性内
 *  POST请求 数据放在 data   属性内
 * */

/**
 * 1、获取终端状态(在线/离线)
 * 参数名	是否必须	类型	说明
 * teid	是	string	终端ID
 * */
export function getTerminalState(options) {
  let data = {
    teid: options.teid,
  };

  return request({
    url: '/common/getTerminalState',
    method: 'post',
    data
  });
}

/**
 * 2、创建任务
 * 参数名	是否必须	类型	说明
 * name	是	string	任务名
 * type	是	string	任务类型 1:多媒体任务
 * overtime	否	long	超时时间，单位毫秒，超期自动删除任务 默认86400000（1天）
 * content	否	String	任务内容
 * teid	是	String	终端ID
 * userSystem	是	String	用户系统信息（浏览器获取用户手机系统信息）
 * */
export function createTask(options) {
  let data = {
    name: options.name,
    type: options.type,
    teid: options.teid,
    userSystem: options.userSystem,
  };

  if (options.overtime) data.overtime = options.overtime;
  if (options.content) data.content = options.content;

  return request({
    url: '/task/createTask',
    method: 'post',
    data
  });
}

/**
 * 3、删除任务
 * 参数名	是否必须	类型	说明
 * id	是	string	任务唯一标识
 * */
export function deleteTask(options) {
  let data = {
    id: options.id,
  };

  return request({
    url: '/task/deleteTask',
    method: 'post',
    data
  });
}

/**
 * 4、执行任务
 * 参数名	是否必须	类型	说明
 * id	是	string	任务唯一标识
 * content	否	String	任务内容
 * */
export function performTask(options) {
  let data = {
    id: options.id,
  };

  if (options.content) data.content = options.content;

  return request({
    url: '/task/performTask',
    method: 'post',
    data
  });
}

/**
 * 5、查任务状态
 * 参数名	是否必须	类型	说明
 * id	是	string	任务唯一标识
 * isDeleteCompleted	否	string	此次请求，如果任务已经完成，是否删除，默认不删除 0:不删除 1:删除
 * */
export function taskStatus(options) {
  let data = {
    id: options.id,
  };

  if (options.isDeleteCompleted) data.isDeleteCompleted = options.isDeleteCompleted;

  return request({
    url: '/task/taskStatus',
    method: 'post',
    data
  });
}

/**
 * 6、上传资源(非文件)
 * 参数名	是否必须	类型	说明
 * kind	是	string	资源类型 3:跑马灯 4:文本
 * name	否	string	资源名
 * taskId	是	string	任务ID
 * content	是	string	资源内容
 * index	是	int	播放序号
 * */
export function uploadNonFile(options) {
  let data = {
    kind: options.kind,
    taskId: options.taskId,
    content: options.content,
    index: options.index,
    //contentType: 'multipart',
  };

  if (options.name) data.name = options.name;

  return request({
    url: '/resource/uploadNonFile',
    method: 'post',
    data
  });
}

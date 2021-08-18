
//接口地址
export const  _HTTP_SERVER_URL = "http://120.79.188.200:8808";
// export const  _HTTP_SERVER_URL = "http://192.168.0.108:8808";
// export const  _HTTP_SERVER_URL = "http://120.79.90.66:8808";
// export const  _HTTP_SERVER_URL = "http://192.168.31.128:8808";

// 验证码
export const getVerifyCode = _HTTP_SERVER_URL +"/api/sms/getVerifyCode";

//校验验证码

export const verifyCode = _HTTP_SERVER_URL +"/api/sms/verifyCode";

//查询app资料
export const getAppConfig = _HTTP_SERVER_URL +"/api/appConfig/getAppConfig";

//查询资料
export const getUserBaseById = _HTTP_SERVER_URL + "/api/user/getUserBaseById";

//编辑个人信息
export const updateUserBaseById = _HTTP_SERVER_URL + "/api/user/updateUserBaseById";

//新增个人群禁言
export const addGroupSlience = _HTTP_SERVER_URL +"/api/groupSlience/addGroupSlience";

//GET查询用户在群信息  包括禁言 是否是管理员 身份 是否在群内
export const getUserClusterVo = _HTTP_SERVER_URL +"/api/groupBase/getUserClusterVo";

//解除个人群禁言
export const deleteGroupSlienceById = _HTTP_SERVER_URL +"/api/groupSlience/deleteGroupSlienceById";

//新增用户消息收藏
export const addMissuCollect = _HTTP_SERVER_URL +"/api/missuCollect/addMissuCollect";

//查询收藏
export const getMissuCollectById = _HTTP_SERVER_URL +"/api/missuCollect/getMissuCollectList";


//删除查询收藏
export const deleteMissuCollectById = _HTTP_SERVER_URL +"/api/missuCollect/deleteMissuCollectById";

//根据用户名查询用户id
export const getUserIdByUserName = _HTTP_SERVER_URL +"/api/user/getUserIdByUserName";

//获取声网音视频token
export const generate = _HTTP_SERVER_URL +"/api/token/generate";

//获取时间戳
export const systemTime = _HTTP_SERVER_URL +"/api/token/systemTime";

//修改备注
export const updRemark = _HTTP_SERVER_URL +"/api/user/updRemark";



//置顶
export const topList=  _HTTP_SERVER_URL +"/api/user/topList";


 //根据id 查群信息
export const getGroupInformation=  _HTTP_SERVER_URL +"/api/groupBase/getGroupInformation";


//根据群短号id查询群信息
export const getGroupCornet=  _HTTP_SERVER_URL +"/api/groupBase/getGroupCornet";


//根据群短号id查询群信息
// const getUserBaseById =  _HTTP_YUEKU_SERVER_URL +"/api/user/getUserBaseById";


//根据群id查询群管理员信息
export const getGroupAdminInfo=  _HTTP_SERVER_URL +"/api/groupBase/getAdminList";

//获取黑名单列表
export const getMyBlackUser = _HTTP_SERVER_URL + "/api/user/getMyBlackUser";

//拉黑/取消拉黑
export const blackUser = _HTTP_SERVER_URL + "/api/user/blackUser";

//隐私设置-隐私设置详情
export const getPrivacyConfigById = _HTTP_SERVER_URL + "/api/privacyConfig/getPrivacyConfigById";

//隐私设置-更新隐私设置
export const updatePrivacyConfig = _HTTP_SERVER_URL + "/api/privacyConfig/updatePrivacyConfig";

//用户相关-用户群聊列表
export const getUserJoinGroup = _HTTP_SERVER_URL + "/api/groupBase/getUserJoinGroup";

//分组列表
export const getFriendGroupList = _HTTP_SERVER_URL + "/api/friendGroup/list";


//
//  //封装请求函数
// const xuAjaxMobule = function () {
// 	let xuAjax =  function () {
//
// 	}
// 	 xuAjax.prototype.get = function (url , data , params) {
// 		 return new Promise(function(resolve, reject){
// 			 $.ajax({
// 				 type: "GET",
// 				 url: url,
// 				 data: data,
// 				 header:{
// 					 "content-type":"application/x-www-form-urlencoded"
// 				 },
// 				 dataType: 'json',
// 				 success(res) {
// 					 resolve(res)
// 				 },
// 				 error(err) {
// 					 reject(err)
// 				 }
// 			 })
// 		 });
// 	 }
// 	xuAjax.prototype.post = function (url , data) {
// 		return new Promise(function(resolve, reject){
// 			$.ajax({
// 				type: "POST",
// 				url: url,
// 				header:{
// 					"content-type":"application/x-www-form-urlencoded"
// 				},
// 				data: data,
// 				dataType: 'json',
// 				success(res) {
// 					resolve(res)
// 				},
// 				error(err) {
// 					reject(err)
// 				}
// 			})
// 		});
// 	}
//
// 	return new xuAjax();
// }()



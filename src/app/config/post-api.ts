import {APP_CONFIG} from "@environments/environment";

//接口地址
export const  _HTTP_SERVER_URL = ["http://", APP_CONFIG.api, ":8808"].join("");
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

//查询余额
export const getCustAccountbaseById = _HTTP_SERVER_URL + "/api/custAccountbase/getCustAccountbaseById";

//查看免打扰状态
export const noDisturbDetail = _HTTP_SERVER_URL + "/api/user/noDisturbDetail";

//查看置顶状态
export const topDetail = _HTTP_SERVER_URL + "/api/user/topDetail";

//编辑个人信息
export const updateUserBaseById = _HTTP_SERVER_URL + "/api/user/updateUserBaseById";

//修改我的群昵称
export const updateNicknameInGroup = _HTTP_SERVER_URL + "/api/groupBase/updateNicknameInGroup";

//GET查询用户在群信息  包括禁言 是否是管理员 身份 是否在群内
export const getUserClusterVo = _HTTP_SERVER_URL +"/api/groupBase/getUserClusterVo";

//新增用户消息收藏
export const addMissuCollect = _HTTP_SERVER_URL +"/api/missuCollect/addMissuCollect";

//查询收藏
export const getMissuCollectById = _HTTP_SERVER_URL +"/api/missuCollect/getMissuCollectList";


//删除查询收藏
export const deleteMissuCollectById = _HTTP_SERVER_URL +"/api/missuCollect/deleteMissuCollectById";

//根据用户名查询用户id
export const getUserIdByUserName = _HTTP_SERVER_URL +"/api/user/getUserIdByUserName";

//获取声网音视频token
export const generateAgoraToken = _HTTP_SERVER_URL +"/api/token/generate";

//获取时间戳
export const systemTime = _HTTP_SERVER_URL +"/api/token/systemTime";

//修改备注
export const updRemark = _HTTP_SERVER_URL + "/api/user/updRemark";

// 用户好友相关 - 查看好友备注
export const getRemark = _HTTP_SERVER_URL + "/api/user/getRemark";

// 用户好友相关 - 获取好友列表
export const getfriendList = _HTTP_SERVER_URL + "/api/user/friendList";

//红包相关 - 是否设置支付密码
export const checkPayKeyIsExist = _HTTP_SERVER_URL + '/api/custAccountbase/checkPayKeyIsExist';

//红包相关 - 设置支付密码
export const updatePayKey = _HTTP_SERVER_URL + '/api/custAccountbase/updatePayKey';

//红包相关 - 发送红包
export const sentRedPacket = _HTTP_SERVER_URL + '/api/redPacket/sentRedPacket';

//红包相关 - 红包详情
export const getRedPacketById = _HTTP_SERVER_URL + '/api/redPacket/getRedPacketById';

//红包相关 - 领取红包
export const robRedPacket = _HTTP_SERVER_URL + '/api/redPacket/robRedPacket';

//红包相关 - 红包记录
export const getConsumeRecordList = _HTTP_SERVER_URL + '/api/custAccountbase/getConsumeRecordList';



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

//获取拉黑我的人
export const getBlackMeUser = _HTTP_SERVER_URL + "/api/user/getBlackUser";

//拉黑/取消拉黑
export const blackUser = _HTTP_SERVER_URL + "/api/user/blackUser";

//隐私设置-隐私设置详情
export const getPrivacyConfigById = _HTTP_SERVER_URL + "/api/privacyConfig/getPrivacyConfigById";

//隐私设置-更新隐私设置
export const updatePrivacyConfig = _HTTP_SERVER_URL + "/api/privacyConfig/updatePrivacyConfig";

//用户相关-用户群聊列表
export const getUserJoinGroup = _HTTP_SERVER_URL + "/api/groupBase/getUserJoinGroup";

//分组api
export const getFriendGroupList = _HTTP_SERVER_URL + "/api/friendGroup/list"; // 分组列表
export const getFriendGroupFriends = _HTTP_SERVER_URL + "/api/friendGroup/friendList"; // 分组下好友列表
export const updateFriendGroup = _HTTP_SERVER_URL + "/api/friendGroup"; // post 创建  put 更新
export const deleteFriendGroupList = _HTTP_SERVER_URL + "/api/friendGroup"; // {groupId} // 删除分组
export const updateFriendGroupMembers = _HTTP_SERVER_URL + "/api/friendGroup/manageFriend"; // 修改分组成员

// 搜索好友
export const getFriendSearch = _HTTP_SERVER_URL + "/api/friend/search";

// 新的朋友
export const getNewFriend = _HTTP_SERVER_URL + "/api/friend/new-friend/";

// 通过id查询群的基本信息
export const getGroupBaseById = _HTTP_SERVER_URL + "/api/groupBase/getGroupBaseById";

// 群组相关 - 更新群的基本信息
export const updateGroupBaseById = _HTTP_SERVER_URL + "/api/groupBase/updateGroupBaseById";

// 设置/删除群成员
export const updateGroupAdmin = _HTTP_SERVER_URL + "/api/groupBase/updateAdmin/";

// 对个人禁言
export const addGroupSilence = _HTTP_SERVER_URL + "/api/groupSilence/addGroupSilence/";

// 解除个人禁言
export const deleteGroupSilenceById = _HTTP_SERVER_URL + "/api/groupSilence/deleteGroupSilenceById/";

// 被禁言的人员列表
export const getGroupSilenceById = _HTTP_SERVER_URL + "/api/groupSilence/getGroupSilenceById/";

// 群页签列表
export const getUserGroupTab = _HTTP_SERVER_URL + "/api/groupBase/getUserGroupTab";

// 更新群页签
export const UpUserGroupTab = _HTTP_SERVER_URL + "/api/groupBase/UpUserGroupTab";

// 群客服列表
export const getGroupCustomerService = _HTTP_SERVER_URL + "/api/groupBase/getGroupCustomerService";

// 更新群客服
export const UpGroupCustomerService = _HTTP_SERVER_URL + "/api/groupBase/UpGroupCustomerService";

// 修改密码
export const UpdatePassword = _HTTP_SERVER_URL + "/api/user/updPwd";

// 单聊漫游消息
export const GetFriendHistory = _HTTP_SERVER_URL + "/v1/chat/friend-his";

// 群聊漫游消息
export const GetGroupHistory = _HTTP_SERVER_URL + "/v1/chat/group-his";

// 群成员
export const GetGroupMember = _HTTP_SERVER_URL + "/api/groupBase/memberList";

// 好友信息
export const GetFriendInfo = _HTTP_SERVER_URL + "/api/friend/info";

// 检查拉黑状态
export const getBlackDetail = _HTTP_SERVER_URL + "/api/user/blackUserDetail";

//获取敏感词列表
export const getSensitiveWord = _HTTP_SERVER_URL + "/api/appConfig/sensitiveWord";

//获取用户的离线指令
export const getUserOfflineInstruct= _HTTP_SERVER_URL + "/api/user/offlineInstruct";

//删除好友
export const getDeleteFriend= _HTTP_SERVER_URL + "/api/friend/delete";

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



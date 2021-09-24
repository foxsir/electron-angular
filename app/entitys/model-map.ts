import 'reflect-metadata';
import UserModel from './user.model';
import BlackListModel from "./black-list.model";
import {BaseEntity} from "typeorm";
import ChatmsgEntityModel from "./chatmsg-entity.model";
import ChattingModel from "./chatting.model";
import ChattingGroupModel from "./chatting-group.model";
import CollectModel from "./collect.model";
import FriendModel from "./friend.model";
import {FriendRequestModel} from "./friend-request.model";
import {GroupModel} from "./group.model";
import {GroupAdminModel} from "./group-admin.model";
import GroupInfoModel from "./group-info.model";
import {GroupMemberModel} from "./group-member.model";
import LocalUserinfoModel from "./local-userinfo.model";
import {RoamLastMsgModel} from "./roam-last-msg.model";
import SessionStatusModel from "./session-status.model";

const ModelMap: Map<string, typeof BaseEntity> = new Map();

ModelMap.set("user", UserModel);
ModelMap.set("blackList", BlackListModel);
ModelMap.set("chatmsgEntity", ChatmsgEntityModel);
ModelMap.set("chatting", ChattingModel);
ModelMap.set("chattingGroup", ChattingGroupModel);
ModelMap.set("collect", CollectModel);
ModelMap.set("friend", FriendModel);
ModelMap.set("friendRequest", FriendRequestModel);
ModelMap.set("group", GroupModel);
ModelMap.set("groupAdmin", GroupAdminModel);
ModelMap.set("groupInfo", GroupInfoModel);
ModelMap.set("groupMember", GroupMemberModel);
ModelMap.set("localUserinfo", LocalUserinfoModel);
ModelMap.set("roamLastMsg", RoamLastMsgModel);
ModelMap.set("sessionStatus", SessionStatusModel);

export default ModelMap;

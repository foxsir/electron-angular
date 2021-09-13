export interface MyGroupFriendListInterface {
  totalCount: number;
  pageSize: number;
  totalPage: number;
  currPage: number;
  list: MyGroupChildFriendListInterface[];
}

export interface MyGroupChildFriendListInterface {
  detailId: number;
  groupId: number;
  friendId: number;
  userAvatarFileName: string;
  nickname: string;
}

export default class LoginInfoModel {
  // 保存提交到服务端的准一身份id，可能是登陆用户名、任意不重复的id等，具体意义由开发者业务层决定
  loginUserId: string;
  // 保存提交到服务端用于身份鉴别和合法性检查的token，它可能是登陆密码、也可能是通过前置http单点
  // 登陆接口拿到的token等，具体意义由业务层决定。
  loginToken: string;
  // 保存本地用户登陆时要提交的额外信息（非必须字段，具体意义由客户端自行决定）
  loginExtra: string;
  // 保存客户端首次登陆时间（此时间由服务端在客户端首次登陆时返回的登陆信息中提供，客户端后绪在
  // 掉重连时带上本字段，以便服务端用于多端互踢判定逻辑中使用）。此值不设置则默认应置为0
  firstLoginTime: number;
}

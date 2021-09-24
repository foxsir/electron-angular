class LoginModel {
  public account?: string = undefined;
  public password?: string = null;
}

const LoginModelColumn = {
  account: "account",
  password: "password"
}

export {LoginModel, LoginModelColumn}

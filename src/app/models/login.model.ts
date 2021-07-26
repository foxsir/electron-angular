class LoginModel {
  public account?: string = null;
  public password?: string = null;
}

const LoginModelColumn = {
  account: "account",
  password: "password"
};

export {LoginModel, LoginModelColumn};

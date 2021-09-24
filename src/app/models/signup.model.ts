class SignupModel {
  public user_mail?: string = null;
  public user_phone?: string = null;
  public code?: string = null;
  public user_psw?: string = null;
  public confirm_password?: string = null;
}

const SignupModelColumn = {
  user_mail: "user_mail",
  user_phone: "user_phone",
  code: "code",
  user_psw: "user_psw",
  confirm_password: "confirm_password",
}

export {SignupModel, SignupModelColumn}

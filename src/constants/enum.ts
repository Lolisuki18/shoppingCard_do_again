//Enum là một kiểu dữ liệu đặc biệt cho phép một biế có thể là 1 tập hợp các
//hằng số định sẵn
//->Biến phải là bằng một trong các giá trị đã được xác định trước cho nó

export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum USER_ROLE {
  Admin, //0
  Staff, //1
  User //2
}

//dùng để phân loại token
export enum TokenType {
  AccessToken, //0
  RefreshToken, //1
  ForgotPasswordToken, //2
  EmailVerificationToken //3
}

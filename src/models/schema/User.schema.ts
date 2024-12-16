// trong này chúng ta có thể dùng class hoặc interface để tạo schema
//nhưng ở đây chúng ta dùng class vì interface trongn ts thì
// +interface nó chỉ đang định dạng 1 kiểu dữ liệu mà thôi
// +class là đại diện cho 1 kiểu và dùng class để tạo object cũng rất là nhanh

import { ObjectId } from 'mongodb'

//khai báo 1 số kiểu dữ liệu enum để sử dụng
//Enum là một kiểu dữ liệu đặc biệt cho phép một biế có thể là 1 tập hợp các
//hằng số định sẵn
//->Biến phải là bằng một trong các giá trị đã được xác định trước cho nó

enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0;
  Verified, //đã xác thực email
  Banned //bị khoá
}

enum USER_ROLE {
  Admin, //0
  Staff, //1
  User //2
}

//khai báo interface USER
//interface dùng để định nghĩa 1 user cần những gì khi mình tạo ra
interface UserType {
  _id?: ObjectId
  //cứ optional là ?
  name?: string
  email: string // mình sẽ cho đăng nhập bằng email
  date_of_birth?: Date
  password: string
  created_at?: Date
  update_at?: Date // lúc mới tạo chưa có gì thì nên cho bằng created at
  email_verify_token?: string // jwt hoặc '' nếu đã được xác thực email
  forgot_password_token?: string // jwt hoặc '' nếu đã xác thực email
  verify?: UserVerifyStatus // đây là dạng enum

  //nhưng cái dưới đây là thông tin ngoài lề
  bio?: string //optional
  location?: string
  website?: string
  username?: string
  avatar?: string // lưu link ảnh chứ ko lưu cái  ảnh
  cover_photo?: string //optional
  role?: USER_ROLE // đây là dạng enum
}

//class sẽ sử dụng các định nghĩa của interface để tạo user đầy đủ
// thông tin thì mới gửi lên database
export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  update_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus

  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string
  role: USER_ROLE
  constructor(user: UserType) {
    const date = new Date() // tạo này cho ngày created_at updated_at bằng nhau
    this._id = user._id || new ObjectId() // sẽ bằng id người dùng nhập hoặc tự tạo
    this.name = user.name || '' //nếu người dùng tạo mà ko truyền ta sẽ để rỗng
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date() // nếu user ko nhập mà tạo thì sẽ cho nó bằng thời gian hiện tại
    this.password = user.password
    //nếu người dùng tạo mà ko nhập thì mình sẽ lấy mặc định ngày này là ngày cập nhập và ngày tạo cùng 1 ngày
    this.created_at = user.created_at || date
    this.update_at = user.update_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    //nếu người dùng đã verify thì nhận còn nếu chưa thì mặc định sẽ là Unverify
    this.verify = user.verify || UserVerifyStatus.Unverified

    // những thông tin ngoài lề nếu người dùng nhập thì nhận còn ko thì để rỗng
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
    //riêng role nếu người dùng ko nhập thì mình sẽ mặc định là user thôi
    this.role = user.role || USER_ROLE.User
  }
  //ta có thể thấy ở phần interface User thì date_of_birth có thể thiếu
  //nhưng khi tạo object từ interface user, thì class user sẽ tự new Date() co date_of_birth
  //-> vì khi lưu vào database tì date_of_birth là ko thể để trống
}

//định nghĩa những gì mà người dùng gửi lên trong request

//register
//mình làm này để định dạng body của req vì khi ta req.body thì nó sẽ ko hiện gợi ý gì cả
//->nếu muốn có gợi ý định dạng thì ta phải định nghĩa kiểu dữ liệu cho body req

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  data_of_birth: string
}

export interface LoginReqBody {
  email: string
  password: string
}

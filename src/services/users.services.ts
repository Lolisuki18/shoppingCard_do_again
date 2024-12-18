import User from '~/models/schema/User.schema'
import databaseService from './database.services'
import { LoginReqBody, RegisterReqBody } from '~/models/schema/requests/Users.requests'
import { hashPassword } from '~/utils/crypto'
import { ObjectId } from 'mongodb'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import RefreshToken from '~/models/schema/RefreshToken.schema'

class UsersService {
  //ký accesstoken
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  //ký refresh token
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }

  //ký cả rf và acc

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  // đăng ký
  async register(payload: RegisterReqBody) {
    // const { email, password } = payload
    let user_id = new ObjectId()
    const result = await databaseService.users.insertOne(
      new User({
        _id: user_id,
        username: `user${user_id.toString()}`, // tạo thêm prop username vào
        ...payload,
        date_of_birth: new Date(payload.data_of_birth),
        //Vì User.schema.ts có date_of_birth là Date
        //Nhưng mà ngườig dùng gửi lên payload là string
        //ta sẽ override lại password bằng password đã được mã hoá trước khi truyền lên
        password: hashPassword(payload.password)
      })
    )
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())
    // lưu lại refresh_token vào collecton refreshTokens mới tạo
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return { access_token, refresh_token }
  }
  //check email có tồn tại hay chưa
  async checkEmailExit(email: string) {
    //vào database tìm xem có không ?
    const user = await databaseService.users.findOne({ email })
    return Boolean(user) // có true, k false
  }
  //đăng nhập
  async login({ email, password }: LoginReqBody) {
    //vào database tìm user đó tìm bằng email và password đã mã hoá
    const user = await databaseService.users.findOne({
      email,
      password: hashPassword(password)
    })
    //nếu ko có user
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }
    //user là 1 object lấy từ môngdb nên nó chỉ có _id ko có user_id
    //và _id nó là 1 object có dạng objectID nên ta phải chuyển nó về string
    const user_id = user._id.toString() //thu thập thông tin user_id để tạo token
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    // lưu lại refresh_token vào collecton refreshTokens mới tạo
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return { access_token, refresh_token }
  }
}
const usersService = new UsersService()
export default usersService

/*
một lưu ý nhỏ là các chỗ ta xài biến môi trường process.env
thì nên chạy lệnh config() để import,
 đó là ta k bị lỗi là vì ta may mắn đã xài các method khác có
  config sẵn trong lúc xài process.env nên ta thêm config(), 
  ta có thể dùng công cụ tìm kiếm để tìm các file thiếu đó hoặc 
  cụ thể là các file jwt.ts , crypto.ts, user.services.ts, database.service.ts(thường tự có) sau đó thêm
*/

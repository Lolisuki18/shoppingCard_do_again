//route này nhận vào email, password và tạo tài khoản cho mình
//nhưng trong lúc tạo tài khoản ta dùng insertOne(là 1 promise)
//nên ta sẽ dùng async await để xử lý bất đồng bộ

import User from '~/models/schema/User.schema'
import databaseService from '~/services/database.services'
import { json, NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/schema/requests/Users.requests'
import usersService from '~/services/users.services'
//và rất có thể trong quá trình get data từ database mình sẽ gặp lỗi, nên phải try catch
// export const registerController = async (
//   //   req: Request<ParamsDictionary, any, RegisterReqBody>,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email, password } = req.body
//   try {
//     const result = await databaseService.users.insertOne(
//       new User({
//         email, //tạo user chỉ cần email, password
//         password
//       })
//     )
//     console.log(result)
//     res.status(200).json({
//       message: 'Register success', //chỉnh lại thông báo
//       result: result
//     })
//   } catch (err) {
//     res.status(400).json({
//       message: 'Register failed', //chỉnh lại thông báo
//       err: err
//     })
//   }
// }
export const registerController = async (req: Request, res: Response) => {
  const { email, password } = JSON.parse(req.body)
  try {
    const result = await usersService.register({ email, password })
    console.log(result)
    res.status(200).json({
      message: 'Register success' //chỉnh lại thông báo
      //   result: result
    })
  } catch (err) {
    res.status(400).json({
      message: 'Register failed', //chỉnh lại thông báo
      err: err
    })
  }
}

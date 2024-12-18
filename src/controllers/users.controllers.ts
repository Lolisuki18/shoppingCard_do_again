//route này nhận vào email, password và tạo tài khoản cho mình
//nhưng trong lúc tạo tài khoản ta dùng insertOne(là 1 promise)
//nên ta sẽ dùng async await để xử lý bất đồng bộ

import User from '~/models/schema/User.schema'
import databaseService from '~/services/database.services'
import { json, NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody, RegisterReqBody } from '~/models/schema/requests/Users.requests'
import usersService from '~/services/users.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
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
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  // const { email, password } = req.body

  //giờ thì ta đã thấy body là RegisterReqBody
  //việc này sẽ giúp code nhắc ta là trong body có gì
  //và ta đã biết chắc chắn body là RegisterReqBody
  //->ta sẽ ko cần lấy lẽ từng các email, password nữa

  //Vậy thì việc này giúp cho ta điều gì ?
  //-Giúp code nhắc ta là trong body có gì
  //- cho ta biết chắc body là RegisterReqBody
  //-Giúp ta ko cần lấy lẽ từng cáii email, password ra nữa

  //thử tạo 1 lỗi
  // throw new Error('tạo thử 1 cái lỗi nè')
  //kiểm tra thêm email ở đây
  const isExistEmail = await usersService.checkEmailExit(req.body.email)
  //ta sẽ nhận được object error và nó sẽ cho ra object rỗng
  //bởi vì thuộc message của error có enumerable là false -> từc là ko thể duyệt và hiển thị
  if (isExistEmail) {
    //sẽ ko hiển thị được message vì Error có message là enumerable: false
    // const errorCustom = new Error('Email already exists') // ta phải set lại enumerable là true
    // Object.defineProperty(errorCustom, 'message', {
    //   enumerable: true
    // })
    // throw errorCustom

    //sử dụng class ErrorWithStatus
    throw new ErrorWithStatus({
      message: 'Email is already exist',
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY //422
    })
  }
  const result = await usersService.register(req.body) //{ email, password } = req.body(nhiếu thông tin hơn)
  console.log(result)
  res.status(200).json({
    message: 'Register success', //chỉnh lại thông báo
    result: result
  })
}

//users.controllers.ts

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  //thêm tý logic vào đây trước khi trả kết quả cho người dùng
  const { email, password } = req.body
  // //mình xà lơ, vì mình chưa có database
  // //nếu có thì mình phải tách nhỏ xuống 1 tầng nữa là service thay vì viết ở đây
  // if (email === 'lolisuki3@gmail.com' && password === 'dD1232456!') {
  //   res.json({
  //     data: {
  //       fname: 'Ninh',
  //       yob: 2004
  //     }
  //   })
  // } else {
  //   res.status(400).json({
  //     error: 'Invalid email or password'
  //   })
  // }
  //userService.login làm nhiệm vụ nhận vào email và password, rồi vào database tìm
  //user đó và tạo access và refresh token
  const result = await usersService.login({ email, password })
  res.status(HTTP_STATUS.OK).json({
    //ok là 200
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result: result
  })
}

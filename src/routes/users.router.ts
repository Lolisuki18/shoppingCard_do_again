//khai báo express
import express from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidation,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
//tạo router
const usersRouter = express.Router() // khai báo router

// usersRouter.get('/login', loginValidator, loginController)

//trog usersRouter ta sẽ tao api getME, để lấy thông tin người dùng

usersRouter.get('/get-me', (req, res) => {
  res.json({
    data: {
      fname: 'Ninh',
      yob: 2004
    }
  })
})

//register
/*
  Description: Register a new user
  Path: /register
  Method: POST
  Body:{
    email:string,
    password:string,
    confirm_password: string
    date_of_birth: ISO8601
  }

*/
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

//gọi  next() để chuyển request sang request handler tiếp theo
// usersRouter.post(
//   '/register',
//   registerValidator,
//   (req, res, next) => {
//     console.log('request handler 1')
//     // next()
//     // //nếu có next thì nó sẽ chạy xuống request handler bên dưới
//     // // nếu k có next thì khi request handler đến đây nó sẽ ko xuống đc
//     // //next thì nó sẽ bị treo ở đây

//     //ta gõ next(err)để chuyển request sang error handler tiếp theo
//     next(new Error('Error from request handler 1')) // next(err)
//   },
//   (req, res, next) => {
//     console.log('request handler 2')
//     next() //gặp next nên sẽ chạy xuống request handler bên dưới
//   },
//   (req, res, next) => {
//     console.log('request handler 3')
//     res.json({ message: 'Register success' })
//     //cuối cùng là res, gữi kết quả cho client
//   },
//   (err, req, res, next) => {
//     console.log('lỗi nè ' + err.message)
//     res.status(400).json({ message: err.message })
//   }
// )

/*
Description: login
path: /user/login
methods: post
body: {email,password}
*/
usersRouter.post('/login', loginValidator, wrapAsync(loginController))
export default usersRouter

/*
  Description: logout
  path: user/logout
  method: POST
  header: {Authorization: Bearer <access_token>}
  body:{refresh_token: string}


  logout phải là method post vì

  khi logout, người dùng sẽ cung cấp lại
  at và rf để xác minh họ là ai, sau đó mình sẽ thu hồi (xóa khỏi hệ thống) rf của họ

  vậy nên ta tạo logout với method post với
  header: Authorization: Bear access_token (dùng để biết account nào muốn logout)
  và body:{refresh_token} (dùng để xóa token trong collection refresh_tokens)
 */

usersRouter.post('/logout', accessTokenValidation, refreshTokenValidator, wrapAsync(logoutController))
//ta có thể thấy rằng bản chất của middleware và controller đều là request handler

//Erorr handler
//nhận Error từ request handler và trả về response
// với mỗi error handler thì chúng ta phải có đủ 4 tham số là
// err, req, res, next
// - nếu chỉ có 3 thì sẽ bị hiểu là request handler
//-Khi xảy ra lỗi trong một hàm synchronus(đồng bô) thì tự động sẽ được chuyển
//sang error handler
//-> vì là đồng bộ nên next(err) hay throw new Error đều sẽ giống nhau
//-Nhưng nếu xảy ra lỗi trong 1 hàm asynchronous thì phải gọi next(err) mới chuyển
//sang error handler được
//->vì throw trong async giống như là promise mà reject vậy , nên muốn chạy bth,
//ta phải làm sao promise.catch, hoặc try cathc và next(err)cho bằng được
//hoặc sử dụng Promise.reject + .catch để thay thế
//->> nó giống như mình tạo ra lỗi rồi chụp nó lại rồi ném nó đi tiếp

//=> lúc nào mà cũm làm thế thì sẽ rất phiền nên ta sẽ tạo WrapReuqestHandler để xử lý lỗi
// ko chỉ nhận lỗi cho mỗi router 1 mà ta sẽ tập kết lỗi cho cả 1 app luôn
//-> ta nên có 1 error hanler như middlerware để khi app có router nào lỗi , thì nó sẽ nhảy
//về cái error hanđlẻ của app luôn
//trở thành error handler cho cả app nên nó nằm cuối app để là điểm tập kết cuối cùng
//các router trên bị lỗi sẽ next(err)  và xuống đây

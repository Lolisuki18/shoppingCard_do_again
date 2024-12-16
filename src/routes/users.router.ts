//khai báo express
import express from 'express'
import { registerController } from '~/controllers/users.controllers'
import { wrapAsync } from '~/utils/handlers'
//tạo router
const usersRouter = express.Router() // khai báo router

usersRouter.use(
  (req, res, next) => {
    console.log('Time:', Date.now())
    next()
    //res.status(400).send("not allowed")
    //console.log(12345) // đoạn code này vẫn chạy
  },
  (req, res, next) => {
    console.log('Time2:', Date.now())
    next()
  }
)

//trog usersRouter ta sẽ tao api getME, để lấy thông tin người dùng

usersRouter.get('/get-me', (req, res) => {
  res.json({
    data: {
      fname: 'Ninh',
      yob: 2004
    }
  })
})

usersRouter.post('/register', registerController)
export default usersRouter

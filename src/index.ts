import express, { NextFunction, Request, Response } from 'express' // import express vào dự á
import usersRouter from './routes/users.router'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
const app = express() // dùng express tạo 1 server
const port = 3000 // server sẽ chạy trên cổng port 3000
databaseService.connect()
app.use(express.json()) // cho sever xài 1 middleware biến đổi json -> ko có cái này sẽ bị biến thành undefined
app.use('/user', usersRouter) // app sẽ sử dụng bô route của userRouter

//app tổng sẽ dùng usersRouter trên nên ta sẽ có 1 đường dẫn là /user/get-me
// nên lúc muốn xài api /get-me thì ta phải truy cập bằng
//localhost:3000:user/get-me

// app.get('/', (req, res) => {
//   res.send('hello world')
// })

//trở thành error handler cho cả app nên nó nằm cuối app để là điểm tập kết cuối cùng
//các router trên bị lỗi sẽ next(err)  và xuống đây
//ta nên tạo nó thành 1 middlware riêng biệt để có thể xử lý nhìu loại lỗi 1 lúc
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Project này đang chạy trên post ${port}`)
})

//để tạo access token và refresh token ta cần tải
// npm install jsonwebtoken @types/jsonwebtoken -D
//này dùng để tải jwt về máy

import express from 'express' // import express vào dự á
import usersRouter from './routes/users.router'
import databaseService from './services/database.services'
const app = express() // dùng express tạo 1 server
const port = 3000 // server sẽ chạy trên cổng port 3000

app.use('/user', usersRouter) // app sẽ sử dụng bô route của userRouter

//app tổng sẽ dùng usersRouter trên nên ta sẽ có 1 đường dẫn là /user/get-me
// nên lúc muốn xài api /get-me thì ta phải truy cập bằng
//localhost:3000:user/get-me

// app.get('/', (req, res) => {
//   res.send('hello world')
// })

app.listen(port, () => {
  console.log(`Project này đang chạy trên post ${port}`)
})

databaseService.connect()

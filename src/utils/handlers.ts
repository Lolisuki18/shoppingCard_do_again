import { Request, Response, NextFunction, RequestHandler } from 'express'
//file này chứa hàm wrapAsync
//wrapAsync là 1 hàm nhận vào 'async request handler'(midd với control)
//và nó tạo ra cấu trúc try catch next cho 'async request handler'
//từ đó 'async request handler' có thể throw thoãi mái mà k cần try cactch next gì cả

// mình định nghĩa lại requestHandler là sẽ nhận vào P và T còn P và T là gì thì mình sẽ định nghĩa sau
export const wrapAsync = <P, T>(func: RequestHandler<P, any, any, T>) => {
  return async (req: Request<P, any, any, T>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

//giải thích ý nghĩa
/*
  wrapAsync(registerController) chạy thì nó sẽ return ra 1 request handler
  và cái route /register của mình sẽ chạy cái request handler giả đó 
  và request handler giả đó đó sẽ chạy registerController mình đã truyền vào 
  và bắt lỗi giúp mình ->nếu có lỗi thì nó chạy vào default error handler trên app handler mình đã tạo ra 
  

*/

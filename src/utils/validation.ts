import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { keyBy } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// export ở ngoài xài đc hàm validate
//đổi thành RunnableValidationChains<ValidationChain>
//vì tý nữa validate sẽ đc xài thế này validate(checkShema({...}))
//mà checkShema() nó là(return) ra RunnableValidationChains<ValidationChain>
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req) //hàm tìm lỗi của middleware schema và đưa vào req

    const errors = validationResult(req) //funct này giúp ta lấy lỗi ra từ biến req
    if (errors.isEmpty()) {
      return next()
    }
    const errorObject = errors.mapped() // giúp ta lấy lỗi ra dưới dạng object
    const entityError = new EntityError({ errors: {} }) //entityError dùng để thay thế cho ErrorObject

    //duyệt qua từng lỗi
    for (const key in errorObject) {
      const { msg } = errorObject[key] // phân rã msg của mỗi lỗi
      //nếu msg bnaof có dạng như ErrorWithStatus và có status khác 422 thì ném lỗi cho default error handler xử lý
      if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        next(msg)
      }
      //nếu lỗi phát sinh ko phải dạng ErrorWithStatus và có status 422 thì thêm và entityError
      entityError.errors[key] = errorObject[key].msg
    }
    //Sau khi tổng hợp xong thì ném ra cho defaultErrorHandler xử lý
    next(entityError)

    // res.status(400).json({ errors: errors.array() })
    // res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errorObject })
    //trong kết quả lỗi được thông báo dưới dạng mảng, và sẽ rất khỏ để xử lý, ta sẽ
    //đổi thành dùng mapped để biến object lỗi thành object chứa các thuộc tính lỗi
    //-> giúp gộp res về thành 1 object báo lỗi thôi, thay vì mảng
  }
}

//validtor mặc định sẽ là lỗi 422 khi có lỗi khác thì sẽ dúng status của lỗi đó

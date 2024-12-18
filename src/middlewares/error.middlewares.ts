import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  //err là lỗi từ các nơi khác truyền xuống,
  //và ta đã quy ước lỗi phải là 1 object có 2 thuộc tính: status và message
  // res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))

  //nếu err là lỗi từ 1 nơi khác truyền xuống

  //lỗi của toàn bộ hệ thống sẽ đổ về đây
  if (error instanceof ErrorWithStatus) {
    res.status(error.status).json(omit(error, ['status']))
  } else {
    //lỗi khác ErorrWithStatus, nghĩa là lỗi bth, lỗi k có status
    //lỗi có tùm lum thứ stack, name , ko có status
    Object.getOwnPropertyNames(error).forEach((key) => {
      Object.defineProperty(error, key, {
        enumerable: true
      })
    }) // lấy  1 danh sách những cái key của nó, rồi đổi tất cả thuộc tính về true -> bời vì mình ko biết có bao nhiêu thuộc tính trong đó
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      errorInfor: omit(error, ['stack'])
    })
  }
}

//vì ta .json(err) error mà error lại chứa status và message nên bị thừa status
//-ta có thể khắc phục bằng cách  .json(err.message) nhưng như vậy ko ổn, vì đây
//chỗ của tập trung các lỗi từ mọi nơi đổ về, nhỡ đâu có 1 lỗi ko có message thì
//vô tình sẽ trả về client là undefined
//-Ta cũng có thể trả ra object k có status bằng cách  delete err.status nhưng như vậy thì có vẻ hơi kì
// => ta sẽ sử dụng lodash để xử vấn đề thừa status trên -> sử dụng hàm omit
//->omit là 1 function trong lodash giúp trả ra object giống err nhưng đã loại bỏ status
//-> cái đặt lodash : (này chỉ có mình xài thôi ko phải cho dự án nên -D)

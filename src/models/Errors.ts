//ở đây thường mình sẽ extend Error để nhận đc báo lỗi ở dòng nào

import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

//sau khi test qua thì ta thấy rằng lỗi mặc định của validator quá nhiều thông
//tin và quá xấu -> ko biết lỗi do phần nào, quá nhiều thông tin thừa
//nên ta sẽ tạo 1 object tên là entityError lỗi có cấu trúc gần giống như errorObject nhưng
//có message thông báo lỗi là Validation error và chỉ chưa field:msg để dễ dàng xử lý hơn
//thay vì quá nhiều thông tin như type, value, msg, path, location

//tạo kiểu lỗi giống thiết kế
//Record là gồm những kiểu dữ liệu giống nhau
type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>
//mày sẽ có 1 cái thuộc tính là string -> trong đó có bao nhiêu cái cũng được nhưng phải có dạng ít nhất 1 cái có dang [key: string]
/*
  {
    key:string: {
        msg: string
        msg: string
        msg: string

    }
  }
*/

export class EntityError extends ErrorWithStatus {
  //sẽ tự có status và message
  errors: ErrorType
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY }) //422
    this.errors = errors
  }
}

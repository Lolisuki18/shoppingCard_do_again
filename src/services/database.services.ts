import { Collection, Db, MongoClient } from 'mongodb'
// nhớ phải  npm install mongodb để cài đặt mongo để kết nối
//npm i dotenv : dùng để tải thử viện để xài .env
import dotenv from 'dotenv'
import User from '~/models/schema/User.schema'
import RefreshToken from '~/models/schema/RefreshToken.schema'
dotenv.config() //kích hoạt liên kết env
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shoppingcard.nlpfy.mongodb.net/?retryWrites=true&w=majority&appName=shoppingCard`
//phải giấu userName và password vào file env để khi đẩy lên git nó sẽ ko bị lộ

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  //method
  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect() // từ 4.7 trở lên ko cần câu lệnh này nữa (optional)
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      //finally {
      // Ensures that the client will close when you finish/error
      //await client.close()  -> khi đã bật sever thì ko cần tắt
      console.log(err)
      throw err
    }
  }
  //tạo method get users để lấy instance của collection users
  // do mình đã định nghĩa , tạo schema để định dạng rõ ràng 1 document user
  //phải trông như thế nào rồi , nên giờ ta sẽ cho hệ thống biết
  //Colletion này đang chưa User(mình đã định nghĩa rồi )
  get users(): Collection<User> {
    //accessor property
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
    //vào db lấy ra collection users, và vì chuỗi truyền vào óc thể là
    //underfind nên mình phải ràng buộc nó là string
  }
  //method này trả về 1 collection chứa các object RefreshToken
  //RefreshToken là class mà ta đã tạo trước đó
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string) // users là tên của collection
  }
}

let databaseService = new DatabaseService()
export default databaseService

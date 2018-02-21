import mongoose from 'mongoose'

/**
 * This class is responsible for DB connection
 */
export class DB {
  constructor() {
    mongoose.Promise = global.Promise
    this.usename = process.env.USER_NAME
    this.password = process.env.PASSWORD
    this.db = process.env.DB
    this.uri = 'mongodb://' + this.usename + ':' + this.password + '@ds143388.mlab.com:43388/' + this.db
  }

  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(this.uri, {
        useMongoClient: true
      })
        .then(() => resolve())
        .catch(() => reject(new Error('cannot connect to DB')))
    })
  }
}

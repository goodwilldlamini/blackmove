import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { fsAuth } from '#/lib/firebase'
import { userStore } from '#/state/user.store'
import type { EdUser } from '#/types/user'
import { dbRead } from './db-read.service'
import dbWrite from './db-write.service'

class AuthService {
  auth = fsAuth

  register(user: EdUser, password: string): Promise<EdUser> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, user.email!, password)
        .then((cred) => {
          const newUser: EdUser = { ...user, uid: cred.user.uid }
          newUser.createdAt = new Date()
          // add to db
          dbWrite
            .createUser(newUser)
            .then(() => {
              // save to storage
              localStorage.setItem('user', JSON.stringify(newUser))
              resolve(newUser)
            })
            .catch((e) => reject(e))
        })
        .catch((e) => reject(e))
    })
  }

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(fsAuth, email, password)
        .then(async (cred) => {
          // fetch user data and update store
          const user = await dbRead.getUserData(cred.user.uid)
          localStorage.setItem('user', JSON.stringify(user))
          userStore.setState({ user })
          resolve()
        })
        .catch((e) => reject(e))
    })
  }
}

const authService = new AuthService()
export default authService

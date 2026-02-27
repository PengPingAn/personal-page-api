export interface User {
  account: string
  email: string
  head: string
  lastIp: string
  lastTime: string
  nickName: string
}

export interface Login {
  account: string
  password: string
  lastIp: string
  lastTime: string
  head: string
}

export interface LoginInfo {
  account: string
  head: string
  total: string
}

export interface UserInfo {
  account: string
  head: string
  email: string
  nickName: string
}

export interface UserPwd {
  password: string
}

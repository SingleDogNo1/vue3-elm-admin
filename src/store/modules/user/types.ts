export default interface UserState {
  token: string | null
  name: string
  roles: string[]
  introduction: string
  avatar: string
}

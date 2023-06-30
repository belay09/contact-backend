const FIND_USER = `
query MyQuery($email:String!) {
    users(where: {user_email: {_eq: $email}}) {
      user_email
      user_id
      user_name
      user_password 
    }
  }
`
const FIND_ADMIN = `
query MyQuery($name:String!) {
  admin(where: {name: {_eq: $name}}) {
    password
    name
    id
  }
}
`
export {FIND_USER,FIND_ADMIN};
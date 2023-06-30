const HASURA_SIGNUP_OPERATION = `
mutation MyQuery ($email:String!,$name:String!,$password:String!){

    insert_users_one(object: {user_email: $email, user_name: $name, user_password: $password}) {
      user_id
    }
}`;
const HASURA_ADMINSIGNUP_OPERATION = `
mutation MyQuery($name:String!,$password:String!) {
  insert_admin_one(object: {name: $name, password: $password}) {
    id
  }
}`;

export {HASURA_SIGNUP_OPERATION,HASURA_ADMINSIGNUP_OPERATION};
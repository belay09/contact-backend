import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import {authenticateToken} from '../middleware/authorization.js';
import { jwtTokens } from '../helpers/jwt-helpers.js'; 
import {finduser} from '../helpers/findUserName.js'
import {HASURA_SIGNUP_OPERATION} from '../query/signup.js';

let refreshTokens = [];

const router = express.Router();

/* GET users listing. */
router.get('/',authenticateToken, async (req, res) => {
  try {
    console.log(req.cookies);
    const users = await pool.query('SELECT * FROM users');
    res.json({users : users.rows});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
const execute = async (variables) => {
  const fetchResponse = await fetch(
    "http://localhost:2000/v1/graphql",
    {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': 'secret'
      },
      body: JSON.stringify({
        query: HASURA_SIGNUP_OPERATION,
        variables
      })
    }
  );
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data);
  return data;

};
router.post('/', async (req, res) => {
  try {
    const { name,email, password } = req.body;
    const { data, error } = await finduser({ email })
    const user = data["users"][0]
    if (user) {
      return res.json({
        message: 'you are  registered no registratrion again'
      })
    }
    // const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
    // if (users.rows.length !== 0) return res.json({message:"we found your email please use to login"});
    const hashedPassword = await bcrypt.hash(password, 10);
    const userCreated = {
      name: name,
      email: email,
      password: hashedPassword,
  }
  await execute(userCreated).then(
    res.json({message:"accaunt succesfully created please login"})

  );

    // const newUser = await pool.query(
      // 'INSERT INTO users (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *'
      // , [req.body.name, req.body.email, hashedPassword]);
    // res.json(jwtTokens(newUser.rows[0]));

  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
 
router.delete('/', async (req,res)=>{
  try {
    const users = await pool.query('DELETE FROM users');
    res.status(204).json(users.rows);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})


export default router;
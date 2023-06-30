import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { jwtTokens } from '../helpers/jwt-helpers.js'; 
import {HASURA_ADMINSIGNUP_OPERATION} from '../query/signup.js';
import {findadmin} from '../helpers/findAdmin.js'
const router = express.Router();
const execute = async (variables) => {
    const fetchResponse = await fetch(
      "http://localhost:2000/v1/graphql",
      {
        method: 'POST',
        headers: {
          'x-hasura-admin-secret': 'secret'
        },
        body: JSON.stringify({
          query: HASURA_ADMINSIGNUP_OPERATION,
          variables
        })
      }
    );
    const data = await fetchResponse.json();
    console.log('DEBUG: ', data);
    return data;
  
  };
router.post('/sign', async (req, res) => {
    try {
      const { name,password } = req.body;
      const { data, error } = await findadmin({ name })
      const user = data["admin"][0]
      if (user) {
        return res.json({
          message: 'thier is an admin accaunt with this name try another name'
        })
      }
      console.log("ub thiere fine")
      // const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
      // if (users.rows.length !== 0) return res.json({message:"we found your email please use to login"});
      const hashedPassword = await bcrypt.hash(password, 10);
      const userCreated = {
        name: name,
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
      res.status(500).json({message: error.message});
    }
  });
  export default router;
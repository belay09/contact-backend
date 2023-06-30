import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { jwtTokens } from '../helpers/jwt-helpers.js';
import {finduser} from '../helpers/findUserName.js'
import {findadmin} from '../helpers/findAdmin.js'
const router = express.Router();
router.post('/login', async (req, res) => {
  try {
    console.log(req.cookies, req.get('origin'));
    const { email, password } = req.body;
    const { data, error } = await finduser({ email })
    const user = data["users"][0]
    if (!user) {
      return res.status(400).json({
        message: 'we do not  find accaunt with this email please try to rigister first'
      })
    }
    // const use
    // const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
    // if (users.rows.length === 0) return res.status(401).json({error:"Email is incorrect"});
    //PASSWORD CHECK
    console.log(user)

    const validPassword = await bcrypt.compare(password, user.user_password);
    if (!validPassword) return res.status(401).json({message: "Incorrect password"});
    //JWT
    const token = jwt.sign({
      "https://hasura.io/jwt/claims":
      {
        "x-hasura-allowed-roles": ["users"],
        "x-hasura-default-role": "users",
        "x-hasura-user-id": `${user.user_id}`,

      }
    }
    
      , process.env.ACCESS_TOKEN_SECRET)
    // let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
    // res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
    res.json({"accessToken":token});
  } catch (error) {
    res.status(401).json({error: error.message});
  }
});

router.get('/refresh_token', (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    console.log(req.cookies);
    if (refreshToken === null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).json({error:error.message});
      let tokens = jwtTokens(user);
      res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
      return res.json(tokens);
    });
  } catch (error) {
    res.status(401).json({error: error.message});
  }
});

router.delete('/refresh_token', (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({message:'Refresh token deleted.'});
  } catch (error) {
    res.status(401).json({error: error.message});
  }
});
router.post('/adminlogin', async (req, res) => {
  try {
    console.log(req.cookies, req.get('origin'));
    const { name, password } = req.body;
    const { data, error } = await findadmin({ name })
    const user = data["admin"][0]
    if (!user) {
      return res.status(400).json({
        message: 'you are not an admin please leave the system if you do not have admin privilage'
      })
    }

    console.log(user)

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({error: "Incorrect password"});
    //JWT
    const token = jwt.sign({
      "https://hasura.io/jwt/claims":
      {
        "x-hasura-allowed-roles": ["admins"],
        "x-hasura-default-role": "admins",
        "x-hasura-user-id": `${user.id}`,

      }
    }
    
      , process.env.ACCESS_TOKEN_SECRET)
    // let tokens = jwtTokens(users.rows[0]);//Gets access and refresh tokens
    // res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
    res.json({"adminToken":token});
  } catch (error) {
    res.status(401).json({error: error.message});
  }
});
export default router;
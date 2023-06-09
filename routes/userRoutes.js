import express from 'express';
import bcrypt from 'bcryptjs';

import expressAsyncHandler from 'express-async-handler';

import User from '../models/UserModel.js';
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.post('/signin', expressAsyncHandler( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(user) {
      if(bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Senha ou email invalidos '});
  })
);

userRouter.post('/signup', expressAsyncHandler( async (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  
  const user = await newUser.save();

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user), 
  });
}));

userRouter.put('/profile', isAuth, expressAsyncHandler( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if(req.body.password) {
      user.password = bcrypt.hashSync(req.body.password);
    }
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser)
    });
  } else {
    res.status(404).send({ message: 'Usuário não encontrado! '});
  }

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user), 
  });
}));

userRouter.get('/listusers', isAuth, expressAsyncHandler( async (req, res, next) => {
  const users = await User.find({});

  if(users) {
    res.status(201).send({
      users,
    });
  } else {
    res.status(404).send({ message: 'Usuários não encontrados! '});
  }

}));



export default userRouter;
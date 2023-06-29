/**
 * @desc middleware to check user password at authentification (POST login route)
 * check user password and if credentials are valid, return a unique token via jwt
 */

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const verifyPassword = async (req, res, next) => {
  try {
    const isUserVerified = await argon2.verify(
      req.user.password,
      req.body.password
    );

    if (isUserVerified) {
      // delete user sensitive information from the request
      delete req.body.password;
      delete req.user.password;

      // create JWT info (token with 1h expiration time)
      const payload = { sub: req.user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // send back the unique JWT token to the client (to be stored in the local or session storage)
      res.send({ token, user: req.user });
    } else {
      // authentication failded (password did not match)
      res
        .status(401)
        .send("le mot de passe saisi ne correspond a l'adresse mail");
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send(
        'une erreur est survenue lors de la vérification du mot de passe utilisateur...'
      );
  }
};

export default verifyPassword;

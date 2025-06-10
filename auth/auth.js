import jwt from 'jsonwebtoken';

const verifyToken = ( req, res, next ) => {
    console.log(req.headers);
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader.split(' ')[1];
  const decodedJWT = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedJWT
  next();
}

export default verifyToken
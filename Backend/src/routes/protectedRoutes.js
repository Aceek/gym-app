import { Router } from 'express';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';

const router = Router();

router.get('/protected', jwtMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

router.get('/check-token', jwtMiddleware, (req, res) => {
  res.json({ message: 'Token is valid' });
});

export default router;

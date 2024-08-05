import sequelize from '../config/sequelize.js';
import User from '../models/user.js';

const viewUsers = async () => {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log(users);
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    await sequelize.close();
  }
};

viewUsers();

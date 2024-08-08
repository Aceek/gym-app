import User from '../models/userModel.js';

const findOrCreateUser = async (googleUser) => {
  try {
    const [user, created] = await User.findOrCreate({
      where: { googleId: googleUser.id },
      defaults: {
        googleId: googleUser.id,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photo: googleUser.photo,
      },
    });
    return { user, created };
  } catch (error) {
    throw new Error('Error finding or creating user');
  }
};

export default {
  findOrCreateUser,
};

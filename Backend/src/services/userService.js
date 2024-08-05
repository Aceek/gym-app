import User from "../models/user.js";

export const findOrCreateUser = async (profile) => {
  let user = await User.findOne({ where: { googleId: profile.id } });
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      displayName: profile.displayName,
      photo: profile.photos[0].value,
    });
  }
  return user;
};

export const findUserById = async (id) => {
  return await User.findByPk(id);
};

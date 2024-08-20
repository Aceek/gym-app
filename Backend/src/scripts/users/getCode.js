import redisClient from "../../config/redisClient.js";

const getCode = async (email, type) => {
  const key = `${type}:${email}`;

  try {
    const code = await redisClient.get(key);
    if (code === null) {
      return null;
    }
    return code;
  } catch (error) {
    console.error(`Error retrieving ${type} code for email: ${email}`, error);
    throw new Error(`Failed to retrieve ${type} code from Redis`);
  }
};

const getCodesForEmail = async (email) => {
  try {
    const resetPasswordCode = await getCode(email, "resetPassword");
    const confirmEmailCode = await getCode(email, "confirmEmail");

    console.log(`Reset Password Code for ${email}: ${resetPasswordCode}`);
    console.log(`Confirm Email Code for ${email}: ${confirmEmailCode}`);
  } catch (error) {
    console.error(error.message);
  } finally {
    redisClient.quit();
  }
};

const email = process.argv[2];
if (!email) {
  console.error("Please provide an email address as an argument");
  process.exit(1);
}

getCodesForEmail(email);

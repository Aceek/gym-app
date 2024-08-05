import sequelize from '../config/sequelize.js';

const testDbConnection = async (req, res) => {
  try {
    const [result] = await sequelize.query("SELECT NOW()");
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export default testDbConnection;

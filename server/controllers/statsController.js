const { Op } = require("sequelize");
const { User, Property } = require("../models");

const getStats = async (req, res) => {
  const [userCount, propertyCount, averageRating] = await Promise.all([
    User.count(),
    Property.count(),
    User.aggregate("feedback_rating", "AVG", {
      where: {
        feedback_rating: { [Op.ne]: null },
      },
    }),
  ]);

  res.json({
    userCount,
    propertyCount,
    averageRating,
  });
};

module.exports = { getStats };

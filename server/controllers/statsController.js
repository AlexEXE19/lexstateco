const { Op } = require("sequelize");
const { User, Property } = require("../models");

const getStats = async (req, res) => {
  const [userCount, propertyCount, averageRating] = await Promise.all([
    User.count(),
    Property.count(),
    User.aggregate("feedbackRating", "AVG", {
      where: {
        feedbackRating: { [Op.ne]: null },
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

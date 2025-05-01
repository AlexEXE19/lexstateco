const db = require("../config/db");

const getAllProperties = (req, res) => {
  const query = "SELECT * FROM properties";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching properties: ", err);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching properties." });
    }

    // Map the results to transform the keys
    const transformedResults = results.map((property) => {
      return {
        id: property.id,
        title: property.title,
        price: property.price,
        location: property.location,
        description: property.description,
        size: property.size,
        distance: property.distance,
        sellerId: property.seller_id,
      };
    });

    res.status(200).json(transformedResults);
  });
};

const getPropertyById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM properties WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error getting property: ", err);
    }
    const transformedResults = result.map((property) => {
      return {
        id: property.id,
        title: property.title,
        price: property.price,
        location: property.location,
        description: property.description,
        size: property.size,
        distance: property.distance,
        sellerId: property.seller_id,
      };
    });

    res.status(200).json(transformedResults);
  });
};

const getPropertiesByLocation = (req, res) => {
  const { location } = req.body;

  const query = `SELECT * FROM properties WHERE location = ?`;

  db.query(query, [location], (err, result) => {
    if (err) {
      console.error("Error getting properties: ", err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: `There are no properties with from this location: ${location}`,
      });
    }

    res.json({ message: "Got all properties with the specific location name" });
  });
};

const getPropertyBySellerId = (req, res) => {
  const { sellerId } = req.params;

  const query = `SELECT * FROM properties WHERE seller_id = ?`;

  db.query(query, [sellerId], (err, result) => {
    if (err) {
      console.error("Error getting properties: ", err);
      return res.status(500).json({ error: "Database error" });
    }

    const camelCasedResult = result.map((property) => ({
      ...property,
      sellerId: property.seller_id,
    }));

    const cleanedResult = camelCasedResult.map(
      ({ seller_id, ...rest }) => rest
    );

    res.json(cleanedResult);
  });
};

const createProperty = (req, res) => {
  const { title, price, location, description, size, distance, sellerId } =
    req.body;

  const query = `
      INSERT INTO properties (title, price, location, description, size, distance, seller_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    query,
    [title, price, location, description, size, distance, sellerId],
    (err, result) => {
      if (err) {
        console.error("Error creating property: ", err);
        return res
          .status(500)
          .json({ message: "An error occurred while adding the property." });
      }

      res.status(201).json({
        message: "Property created successfully",
        property: {
          id: result.insertId,
          title,
          price,
          location,
          description,
          size,
          distance,
          sellerId,
        },
      });
    }
  );
};

const editProperty = (req, res) => {
  const { propertyId } = req.params;
  const { title, price, imageUrl, description } = req.body;

  const query = `UPDATE properties SET title = ?, price = ?, image_url = ?, description = ? WHERE id = ?`;

  db.query(
    query,
    [title, price, imageUrl, description, propertyId],
    (err, result) => {
      if (err) {
        console.error("Error updating property: ", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({ message: "Property updated successfully" });
    }
  );
};

const deleteProperty = (req, res) => {
  const { id } = req.params;
  console.log("PROPERTY ID IS: ", id);
  const query = "DELETE FROM properties WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting property: ", err);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting the property." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  });
};

// const deleteUserProperties = (req, res) => {
//   const { usedId } = req.body;
//   const query = "DELETE FROM properties WHERE user_id = ?";

//   db.query(query, [userId], (err, result) => {
//     if (err) {
//       console.error("Error deleting property: ", err);
//       return res
//         .status(500)
//         .json({ message: "An error occurred while deleting the property." });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         message: `The user with the id: ${userId} doesn't exist have properties`,
//       });
//     }

//     res.status(200).json({ message: "User's properties deleted successfully" });
//   });
// };

module.exports = {
  getAllProperties,
  getPropertyById,
  getPropertiesByLocation,
  getPropertyBySellerId,
  createProperty,
  editProperty,
  deleteProperty,
};

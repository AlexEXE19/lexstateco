// Runs the real controller against a real, throwaway MySQL database
// (started by test/globalSetup.js) instead of a mocked Sequelize model.
// This is what would have caught bugs like the savedPropertiesController
// where-clause mismatch, which mocked unit tests can't - a mock accepts
// whatever query shape you hand it, a real database doesn't.
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = require("../../test/testDbConfig");

process.env.DB_HOST = DB_HOST;
process.env.DB_PORT = DB_PORT;
process.env.DB_USER = DB_USER;
process.env.DB_PASSWORD = DB_PASSWORD;
process.env.DB_NAME = DB_NAME;

const { sequelize, Property, User } = require("../../models");
const {
  createProperty,
  getPropertyById,
  editProperty,
  deleteProperty,
} = require("../propertyController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// res.json here is a plain mock, so unlike real Express it never runs the
// value through JSON.stringify - which is what actually calls Sequelize's
// toJSON() (and renames seller_id -> sellerId, etc.) on a real request.
// Do that ourselves so assertions see what a real client would.
const jsonOf = (value) =>
  typeof value?.toJSON === "function" ? value.toJSON() : value;

describe("propertyController (integration, real MySQL)", () => {
  let sellerId;
  let otherUserId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const seller = await User.create({
      first_name: "Alex",
      last_name: "Seller",
      email: "integration-seller@example.com",
      password: "hashed",
      phone: "555-0000",
    });
    sellerId = seller.id;

    const other = await User.create({
      first_name: "Not",
      last_name: "TheSeller",
      email: "integration-other@example.com",
      password: "hashed",
      phone: "555-0001",
    });
    otherUserId = other.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("creates a property (seller id from the authenticated user), persists it, and can read it back", async () => {
    const req = {
      user: { id: sellerId },
      body: {
        title: "Integration Test Loft",
        price: "300000",
        location: "Testville",
        neighborhood: "Central",
        zipCode: "00000",
        description: "Created by an integration test",
        size: "900",
      },
    };
    const res = mockRes();

    await createProperty(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const created = res.json.mock.calls[0][0].property;
    expect(created.id).toBeDefined();

    const getReq = { params: { id: created.id } };
    const getRes = mockRes();
    await getPropertyById(getReq, getRes);

    const fetched = jsonOf(getRes.json.mock.calls[0][0]);
    expect(fetched.title).toBe("Integration Test Loft");
    expect(fetched.sellerId).toBe(sellerId);
  });

  it("edits a property in place when the requester is its seller", async () => {
    const createReq = {
      user: { id: sellerId },
      body: {
        title: "Before Edit",
        price: "100000",
        location: "Testville",
        neighborhood: "Central",
        zipCode: "00000",
        description: "desc",
        size: "500",
      },
    };
    const createRes = mockRes();
    await createProperty(createReq, createRes);
    const propertyId = createRes.json.mock.calls[0][0].property.id;

    const editReq = {
      params: { propertyId },
      user: { id: sellerId },
      body: {
        title: "After Edit",
        price: "150000",
        location: "Testville",
        neighborhood: "Central",
        zipCode: "00000",
        description: "updated desc",
        size: "550",
      },
    };
    const editRes = mockRes();
    await editProperty(editReq, editRes);

    expect(editRes.status).toHaveBeenCalledWith(200);

    const getReq = { params: { id: propertyId } };
    const getRes = mockRes();
    await getPropertyById(getReq, getRes);

    const fetched = jsonOf(getRes.json.mock.calls[0][0]);
    expect(fetched.title).toBe("After Edit");
    expect(fetched.price).toBe("150000");
  });

  it("refuses to edit a property that belongs to someone else", async () => {
    const createReq = {
      user: { id: sellerId },
      body: {
        title: "Protected Listing",
        price: "100000",
        location: "Testville",
        neighborhood: "Central",
        zipCode: "00000",
        description: "desc",
        size: "500",
      },
    };
    const createRes = mockRes();
    await createProperty(createReq, createRes);
    const propertyId = createRes.json.mock.calls[0][0].property.id;

    const editReq = {
      params: { propertyId },
      user: { id: otherUserId },
      body: { title: "Hijacked" },
    };
    const editRes = mockRes();
    await editProperty(editReq, editRes);

    expect(editRes.status).toHaveBeenCalledWith(403);

    const getReq = { params: { id: propertyId } };
    const getRes = mockRes();
    await getPropertyById(getReq, getRes);

    const fetched = jsonOf(getRes.json.mock.calls[0][0]);
    expect(fetched.title).toBe("Protected Listing");
  });

  it("deletes a property so it can no longer be found", async () => {
    const createReq = {
      user: { id: sellerId },
      body: {
        title: "To Be Deleted",
        price: "50000",
        location: "Testville",
        neighborhood: "Central",
        zipCode: "00000",
        description: "desc",
        size: "300",
      },
    };
    const createRes = mockRes();
    await createProperty(createReq, createRes);
    const propertyId = createRes.json.mock.calls[0][0].property.id;

    const deleteReq = { params: { propertyId }, user: { id: sellerId } };
    const deleteRes = mockRes();
    await deleteProperty(deleteReq, deleteRes);

    expect(deleteRes.status).toHaveBeenCalledWith(200);

    const getReq = { params: { id: propertyId } };
    const getRes = mockRes();
    await getPropertyById(getReq, getRes);

    expect(getRes.status).toHaveBeenCalledWith(404);
  });
});

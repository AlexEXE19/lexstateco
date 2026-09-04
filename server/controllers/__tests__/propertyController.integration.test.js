// Runs the real controller against a real, throwaway Postgres database
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
// toJSON() on a real request. Do that ourselves so assertions see what a
// real client would.
const jsonOf = (value) =>
  typeof value?.toJSON === "function" ? value.toJSON() : value;

const testLocation = {
  country: "Testland",
  city: "Testville",
  neighborhood: "Central",
  address: "1 Test Way",
  zipCode: "00000",
};

const baseListing = {
  price: "300000",
  location: testLocation,
  description: "Created by an integration test",
  size: "900",
  type: "apartment",
  bedrooms: 2,
  bathrooms: 1,
};

describe("propertyController (integration, real Postgres)", () => {
  let agentId;
  let otherUserId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const agent = await User.create({
      firstName: "Alex",
      lastName: "Agent",
      email: "integration-agent@example.com",
      password: "hashed",
      phone: "555-0000",
    });
    agentId = agent.id;

    const other = await User.create({
      firstName: "Not",
      lastName: "TheAgent",
      email: "integration-other@example.com",
      password: "hashed",
      phone: "555-0001",
    });
    otherUserId = other.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("creates a property (agent id from the authenticated user), persists it, and can read it back", async () => {
    const req = {
      user: { id: agentId },
      body: baseListing,
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
    expect(fetched.price).toBe(baseListing.price);
    expect(fetched.agentId).toBe(agentId);
    expect(fetched.location.city).toBe("Testville");
  });

  it("edits a property in place when the requester is its agent", async () => {
    const createReq = {
      user: { id: agentId },
      body: { ...baseListing, price: "100000" },
    };
    const createRes = mockRes();
    await createProperty(createReq, createRes);
    const propertyId = createRes.json.mock.calls[0][0].property.id;

    const editReq = {
      params: { propertyId },
      user: { id: agentId },
      body: { ...baseListing, price: "150000" },
    };
    const editRes = mockRes();
    await editProperty(editReq, editRes);

    expect(editRes.status).toHaveBeenCalledWith(200);

    const getReq = { params: { id: propertyId } };
    const getRes = mockRes();
    await getPropertyById(getReq, getRes);

    const fetched = jsonOf(getRes.json.mock.calls[0][0]);
    expect(fetched.price).toBe("150000");
  });

  it("refuses to edit a property that belongs to someone else", async () => {
    const createReq = {
      user: { id: agentId },
      body: baseListing,
    };
    const createRes = mockRes();
    await createProperty(createReq, createRes);
    const propertyId = createRes.json.mock.calls[0][0].property.id;

    const editReq = {
      params: { propertyId },
      user: { id: otherUserId },
      body: { price: "999999" },
    };
    const editRes = mockRes();
    await editProperty(editReq, editRes);

    expect(editRes.status).toHaveBeenCalledWith(403);

    const getReq = { params: { id: propertyId } };
    const getRes = mockRes();
    await getPropertyById(getReq, getRes);

    const fetched = jsonOf(getRes.json.mock.calls[0][0]);
    expect(fetched.price).toBe(baseListing.price);
  });

  it("deletes a property so it can no longer be found", async () => {
    const createReq = {
      user: { id: agentId },
      body: { ...baseListing, price: "50000" },
    };
    const createRes = mockRes();
    await createProperty(createReq, createRes);
    const propertyId = createRes.json.mock.calls[0][0].property.id;

    const deleteReq = { params: { propertyId }, user: { id: agentId } };
    const deleteRes = mockRes();
    await deleteProperty(deleteReq, deleteRes);

    expect(deleteRes.status).toHaveBeenCalledWith(200);

    const getReq = { params: { id: propertyId } };
    const getRes = mockRes();
    await getPropertyById(getReq, getRes);

    expect(getRes.status).toHaveBeenCalledWith(404);
  });
});

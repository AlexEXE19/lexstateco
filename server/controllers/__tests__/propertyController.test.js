jest.mock("../../models/Property", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
}));

const Property = require("../../models/Property");
const {
  getPropertyById,
  createProperty,
  editProperty,
  deleteProperty,
} = require("../propertyController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const testLocation = {
  country: "USA",
  city: "Springfield",
  neighborhood: "Downtown",
  address: "1 Main St",
  zipCode: "62701",
};

describe("propertyController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("createProperty", () => {
    it("takes the agent id from the authenticated user, not the request body", async () => {
      Property.create.mockResolvedValue({ id: 1 });

      const req = {
        user: { id: 2 },
        body: {
          price: "250000",
          location: testLocation,
          description: "Nice loft",
          size: "850",
          type: "apartment",
          bedrooms: 2,
          bathrooms: 1,
          agentId: 999, // should be ignored
        },
      };
      const res = mockRes();

      await createProperty(req, res);

      expect(Property.create).toHaveBeenCalledWith(
        expect.objectContaining({
          location: testLocation,
          agentId: 2,
          imageRefs: [],
        }),
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getPropertyById", () => {
    it("returns 404 for an unknown id", async () => {
      Property.findOne.mockResolvedValue(null);

      const req = { params: { id: "999" } };
      const res = mockRes();

      await getPropertyById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns the property when found", async () => {
      const property = { id: 1, size: "850" };
      Property.findOne.mockResolvedValue(property);

      const req = { params: { id: "1" } };
      const res = mockRes();

      await getPropertyById(req, res);

      expect(res.json).toHaveBeenCalledWith(property);
    });
  });

  describe("editProperty", () => {
    it("returns 404 when the property does not exist", async () => {
      Property.findByPk.mockResolvedValue(null);

      const req = {
        params: { propertyId: "999" },
        user: { id: 2 },
        body: {},
      };
      const res = mockRes();

      await editProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns 403 when the requester isn't the property's agent", async () => {
      Property.findByPk.mockResolvedValue({
        id: 1,
        agentId: 2,
        update: jest.fn(),
      });

      const req = {
        params: { propertyId: "1" },
        user: { id: 999 },
        body: { price: "999999" },
      };
      const res = mockRes();

      await editProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("updates the property when the requester is its agent", async () => {
      const update = jest.fn().mockResolvedValue(undefined);
      Property.findByPk.mockResolvedValue({
        id: 1,
        agentId: 2,
        update,
      });

      const req = {
        params: { propertyId: "1" },
        user: { id: 2 },
        body: { price: "260000", location: testLocation },
      };
      const res = mockRes();

      await editProperty(req, res);

      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({
          price: "260000",
          location: testLocation,
        }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteProperty", () => {
    it("returns 404 when the property does not exist", async () => {
      Property.findByPk.mockResolvedValue(null);

      const req = { params: { propertyId: "999" }, user: { id: 2 } };
      const res = mockRes();

      await deleteProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns 403 when the requester isn't the property's agent", async () => {
      Property.findByPk.mockResolvedValue({
        id: 1,
        agentId: 2,
        destroy: jest.fn(),
      });

      const req = { params: { propertyId: "1" }, user: { id: 999 } };
      const res = mockRes();

      await deleteProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("deletes the property when the requester is its agent", async () => {
      const destroy = jest.fn().mockResolvedValue(undefined);
      Property.findByPk.mockResolvedValue({ id: 1, agentId: 2, destroy });

      const req = { params: { propertyId: "1" }, user: { id: 2 } };
      const res = mockRes();

      await deleteProperty(req, res);

      expect(destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

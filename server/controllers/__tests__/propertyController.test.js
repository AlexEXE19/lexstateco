jest.mock("../../models/Property", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
}));

const Property = require("../../models/Property");
const {
  getPropertyById,
  createProperty,
  deleteProperty,
} = require("../propertyController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("propertyController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("createProperty", () => {
    it("maps the camelCase request body onto the model's snake_case columns", async () => {
      Property.create.mockResolvedValue({ id: 1, title: "Loft" });

      const req = {
        body: {
          title: "Loft",
          price: "250000",
          location: "Springfield",
          neighborhood: "Downtown",
          zipCode: "62701",
          description: "Nice loft",
          size: "850",
          sellerId: 2,
        },
      };
      const res = mockRes();

      await createProperty(req, res);

      expect(Property.create).toHaveBeenCalledWith(
        expect.objectContaining({
          zip_code: "62701",
          seller_id: 2,
          image_refs: [],
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
      const property = { id: 1, title: "Loft" };
      Property.findOne.mockResolvedValue(property);

      const req = { params: { id: "1" } };
      const res = mockRes();

      await getPropertyById(req, res);

      expect(res.json).toHaveBeenCalledWith(property);
    });
  });

  describe("deleteProperty", () => {
    it("returns 404 when nothing was deleted", async () => {
      Property.destroy.mockResolvedValue(0);

      const req = { params: { propertyId: "999" } };
      const res = mockRes();

      await deleteProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns 200 when the property is deleted", async () => {
      Property.destroy.mockResolvedValue(1);

      const req = { params: { propertyId: "1" } };
      const res = mockRes();

      await deleteProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

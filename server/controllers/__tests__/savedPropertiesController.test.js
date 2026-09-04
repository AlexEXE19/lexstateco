jest.mock("../../models", () => ({
  SavedProperty: {
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

const { SavedProperty } = require("../../models");
const {
  getSavedPropertiesByUserId,
  checkIfPropertyIsSaved,
  saveProperty,
  unsaveProperty,
} = require("../savedPropertiesController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("savedPropertiesController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getSavedPropertiesByUserId", () => {
    it("queries by the userId column", async () => {
      SavedProperty.findAll.mockResolvedValue([{ propertyId: 1 }]);
      const req = { params: { userId: "5" }, user: { id: "5" } };
      const res = mockRes();

      await getSavedPropertiesByUserId(req, res);

      expect(SavedProperty.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: "5" } }),
      );
      expect(res.json).toHaveBeenCalledWith([{ propertyId: 1 }]);
    });

    it("returns 403 when requesting someone else's saved list", async () => {
      const req = { params: { userId: "5" }, user: { id: "999" } };
      const res = mockRes();

      await getSavedPropertiesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(SavedProperty.findAll).not.toHaveBeenCalled();
    });
  });

  describe("checkIfPropertyIsSaved", () => {
    // Regression test: this used to query with mismatched field names
    // against a model whose real columns didn't match, so the "is this
    // saved?" check silently always failed.
    it("queries by the userId/propertyId columns, using the authenticated user's id", async () => {
      SavedProperty.count.mockResolvedValue(1);
      const req = { body: { propertyId: "9" }, user: { id: "5" } };
      const res = mockRes();

      await checkIfPropertyIsSaved(req, res);

      expect(SavedProperty.count).toHaveBeenCalledWith({
        where: { userId: "5", propertyId: "9" },
      });
      expect(res.json).toHaveBeenCalledWith({ count: 1 });
    });
  });

  describe("saveProperty", () => {
    it("returns 400 when propertyId is missing", async () => {
      const req = { body: {}, user: { id: "5" } };
      const res = mockRes();

      await saveProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(SavedProperty.create).not.toHaveBeenCalled();
    });

    it("creates a saved-property row for the authenticated user", async () => {
      SavedProperty.create.mockResolvedValue({
        userId: "5",
        propertyId: "9",
      });
      const req = { body: { propertyId: "9" }, user: { id: "5" } };
      const res = mockRes();

      await saveProperty(req, res);

      expect(SavedProperty.create).toHaveBeenCalledWith({
        userId: "5",
        propertyId: "9",
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Property saved successfully" }),
      );
    });
  });

  describe("unsaveProperty", () => {
    it("destroys the saved-property row for the authenticated user", async () => {
      SavedProperty.destroy.mockResolvedValue(1);
      const req = { body: { propertyId: "9" }, user: { id: "5" } };
      const res = mockRes();

      await unsaveProperty(req, res);

      expect(SavedProperty.destroy).toHaveBeenCalledWith({
        where: { userId: "5", propertyId: "9" },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Property unsaved successfully" }),
      );
    });
  });
});

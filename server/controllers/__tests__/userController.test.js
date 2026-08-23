jest.mock("../../models", () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const bcrypt = require("bcrypt");
const { User } = require("../../models");
const {
  getUserById,
  authenticateUser,
  createUser,
} = require("../userController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("userController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("createUser", () => {
    it("stores a bcrypt hash instead of the plaintext password and returns a token", async () => {
      User.create.mockResolvedValue({
        toJSON: () => ({
          id: 1,
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          phone: "555-0100",
          password: "hashed",
        }),
      });

      const req = {
        body: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          password: "secret123",
          phone: "555-0100",
        },
      };
      const res = mockRes();

      await createUser(req, res);

      const created = User.create.mock.calls[0][0];
      expect(created.password).not.toBe("secret123");
      expect(await bcrypt.compare("secret123", created.password)).toBe(true);

      expect(res.status).toHaveBeenCalledWith(201);
      const payload = res.json.mock.calls[0][0];
      expect(payload.user.password).toBeUndefined();
      expect(typeof payload.token).toBe("string");
    });
  });

  describe("authenticateUser", () => {
    it("rejects an incorrect password with 401", async () => {
      const hashed = await bcrypt.hash("correct-password", 10);
      User.findOne.mockResolvedValue({ password: hashed });

      const req = {
        body: { email: "jane@example.com", password: "wrong-password" },
      };
      const res = mockRes();

      await authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns a signed token for a correct password", async () => {
      const hashed = await bcrypt.hash("correct-password", 10);
      User.findOne.mockResolvedValue({
        password: hashed,
        toJSON: () => ({
          id: 1,
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          phone: "555-0100",
          password: hashed,
        }),
      });

      const req = {
        body: { email: "jane@example.com", password: "correct-password" },
      };
      const res = mockRes();

      await authenticateUser(req, res);

      const payload = res.json.mock.calls[0][0];
      expect(typeof payload.token).toBe("string");
      expect(payload.user.password).toBeUndefined();
    });

    it("returns 404 when no user matches the email", async () => {
      User.findOne.mockResolvedValue(null);

      const req = { body: { email: "nobody@example.com", password: "x" } };
      const res = mockRes();

      await authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getUserById", () => {
    it("returns 404 when the user does not exist", async () => {
      User.findByPk.mockResolvedValue(null);

      const req = { params: { id: "999" } };
      const res = mockRes();

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns the user when found", async () => {
      const user = { id: 1, email: "jane@example.com" };
      User.findByPk.mockResolvedValue(user);

      const req = { params: { id: "1" } };
      const res = mockRes();

      await getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });
});

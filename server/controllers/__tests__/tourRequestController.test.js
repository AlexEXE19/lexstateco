jest.mock("../../models", () => ({
  TourRequest: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  Property: {
    findByPk: jest.fn(),
  },
  User: {},
  Notification: {
    create: jest.fn(),
  },
  Conversation: {
    findOrCreate: jest.fn(),
  },
}));

const {
  TourRequest,
  Property,
  Notification,
  Conversation,
} = require("../../models");
const {
  createTourRequest,
  updateTourRequestStatus,
  getTourRequestsByRequester,
  getTourRequestsBySeller,
  getTourRequestByRequesterAndProperty,
} = require("../tourRequestController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("tourRequestController", () => {
  // resetAllMocks (not clearAllMocks) so a mockRejectedValue set by one test
  // can't leak its implementation into the next test.
  afterEach(() => jest.resetAllMocks());

  describe("createTourRequest", () => {
    it("returns 400 when required fields are missing", async () => {
      const req = { user: { id: 3 }, body: { propertyId: 1 } };
      const res = mockRes();

      await createTourRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(TourRequest.create).not.toHaveBeenCalled();
    });

    it("returns 404 when the property doesn't exist", async () => {
      Property.findByPk.mockResolvedValue(null);
      const req = {
        user: { id: 3 },
        body: { propertyId: 999, requestedAt: "2026-09-01T10:00:00.000Z" },
      };
      const res = mockRes();

      await createTourRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(TourRequest.create).not.toHaveBeenCalled();
    });

    it("takes the requester from the token and the seller from the property, not the request body", async () => {
      Property.findByPk.mockResolvedValue({ id: 10, seller_id: 2 });
      TourRequest.create.mockResolvedValue({ id: 1 });
      TourRequest.findByPk.mockResolvedValue({
        id: 1,
        Property: { title: "Sunny Loft" },
      });

      const req = {
        user: { id: 3 },
        body: {
          propertyId: 10,
          sellerId: 999, // should be ignored in favor of the property lookup
          requesterId: 999, // should be ignored in favor of the token
          requestedAt: "2026-09-01T10:00:00.000Z",
        },
      };
      const res = mockRes();

      await createTourRequest(req, res);

      expect(TourRequest.create).toHaveBeenCalledWith({
        property_id: 10,
        seller_id: 2,
        requester_id: 3,
        requested_at: "2026-09-01T10:00:00.000Z",
        status: "pending",
      });
      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ owner_id: 2, type: "incoming_request" }),
      );
      expect(Conversation.findOrCreate).toHaveBeenCalledWith({
        where: { property_id: 10, buyer_id: 3 },
        defaults: { seller_id: 2 },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("still responds successfully when the notification insert fails", async () => {
      Property.findByPk.mockResolvedValue({ id: 10, seller_id: 2 });
      TourRequest.create.mockResolvedValue({ id: 1 });
      TourRequest.findByPk.mockResolvedValue({
        id: 1,
        Property: { title: "Sunny Loft" },
      });
      Notification.create.mockRejectedValue(new Error("db down"));

      const req = {
        user: { id: 3 },
        body: {
          propertyId: 10,
          requestedAt: "2026-09-01T10:00:00.000Z",
        },
      };
      const res = mockRes();

      await createTourRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateTourRequestStatus", () => {
    it("rejects a status outside the allowed set", async () => {
      const req = {
        params: { id: "1" },
        body: { status: "bogus" },
        user: { id: 2 },
      };
      const res = mockRes();

      await updateTourRequestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 404 when the request does not exist", async () => {
      TourRequest.findByPk.mockResolvedValue(null);
      const req = {
        params: { id: "999" },
        body: { status: "accepted" },
        user: { id: 2 },
      };
      const res = mockRes();

      await updateTourRequestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("lets the seller accept a request", async () => {
      const save = jest.fn().mockResolvedValue(undefined);
      TourRequest.findByPk.mockResolvedValue({
        id: 1,
        seller_id: 2,
        requester_id: 3,
        status: "pending",
        Property: { title: "Sunny Loft" },
        save,
      });
      const req = {
        params: { id: "1" },
        body: { status: "accepted" },
        user: { id: 2 },
      };
      const res = mockRes();

      await updateTourRequestStatus(req, res);

      expect(save).toHaveBeenCalled();
      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ owner_id: 3, type: "request_update" }),
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Status updated" }),
      );
    });

    it("blocks the requester from accepting their own request", async () => {
      const save = jest.fn();
      TourRequest.findByPk.mockResolvedValue({
        id: 1,
        seller_id: 2,
        requester_id: 3,
        status: "pending",
        Property: { title: "Sunny Loft" },
        save,
      });
      const req = {
        params: { id: "1" },
        body: { status: "accepted" },
        user: { id: 3 }, // the requester, not the seller
      };
      const res = mockRes();

      await updateTourRequestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(save).not.toHaveBeenCalled();
    });

    it("lets the requester cancel their own request", async () => {
      const save = jest.fn().mockResolvedValue(undefined);
      TourRequest.findByPk.mockResolvedValue({
        id: 1,
        seller_id: 2,
        requester_id: 3,
        status: "pending",
        Property: { title: "Sunny Loft" },
        save,
      });
      const req = {
        params: { id: "1" },
        body: { status: "canceled" },
        user: { id: 3 },
      };
      const res = mockRes();

      await updateTourRequestStatus(req, res);

      expect(save).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(403);
    });

    it("blocks the seller from canceling on the requester's behalf", async () => {
      const save = jest.fn();
      TourRequest.findByPk.mockResolvedValue({
        id: 1,
        seller_id: 2,
        requester_id: 3,
        status: "pending",
        Property: { title: "Sunny Loft" },
        save,
      });
      const req = {
        params: { id: "1" },
        body: { status: "canceled" },
        user: { id: 2 }, // the seller, not the requester
      };
      const res = mockRes();

      await updateTourRequestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(save).not.toHaveBeenCalled();
    });
  });

  describe("getTourRequestsByRequester", () => {
    it("filters by the requester_id column", async () => {
      TourRequest.findAll.mockResolvedValue([]);
      const req = { params: { requesterId: "3" }, user: { id: "3" } };
      const res = mockRes();

      await getTourRequestsByRequester(req, res);

      expect(TourRequest.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { requester_id: "3" } }),
      );
    });

    it("returns 403 for someone else's requests", async () => {
      const req = { params: { requesterId: "3" }, user: { id: "999" } };
      const res = mockRes();

      await getTourRequestsByRequester(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(TourRequest.findAll).not.toHaveBeenCalled();
    });
  });

  describe("getTourRequestsBySeller", () => {
    it("filters by the seller_id column", async () => {
      TourRequest.findAll.mockResolvedValue([]);
      const req = { params: { sellerId: "2" }, user: { id: "2" } };
      const res = mockRes();

      await getTourRequestsBySeller(req, res);

      expect(TourRequest.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { seller_id: "2" } }),
      );
    });
  });

  describe("getTourRequestByRequesterAndProperty", () => {
    it("returns 404 when no matching request exists", async () => {
      TourRequest.findOne.mockResolvedValue(null);
      const req = {
        params: { requesterId: "3", propertyId: "10" },
        user: { id: "3" },
      };
      const res = mockRes();

      await getTourRequestByRequesterAndProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns the latest matching request", async () => {
      const found = { id: 1, requester_id: "3", property_id: "10" };
      TourRequest.findOne.mockResolvedValue(found);
      const req = {
        params: { requesterId: "3", propertyId: "10" },
        user: { id: "3" },
      };
      const res = mockRes();

      await getTourRequestByRequesterAndProperty(req, res);

      expect(res.json).toHaveBeenCalledWith(found);
    });
  });
});

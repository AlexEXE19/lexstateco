jest.mock("../../data/locationTags", () => ({
  "Tag A": ["Alpha"],
  "Tag B": ["Beta"],
  "Tag C": ["Gamma", "Delta"],
  "Tag D": ["Epsilon"],
}));

const { getCuratedPicks } = require("../curatedController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("curatedController", () => {
  describe("getCuratedPicks", () => {
    it("returns 3 picks, each a real tag with one of its own locations", () => {
      const req = {};
      const res = mockRes();

      getCuratedPicks(req, res);

      const picks = res.json.mock.calls[0][0];
      expect(picks).toHaveLength(3);
      picks.forEach((pick) => {
        expect(["Tag A", "Tag B", "Tag C", "Tag D"]).toContain(pick.tag);
        expect(pick.location).toBeDefined();
      });
    });

    it("never repeats the same tag twice in one response", () => {
      const req = {};
      const res = mockRes();

      getCuratedPicks(req, res);

      const picks = res.json.mock.calls[0][0];
      const tags = picks.map((p) => p.tag);
      expect(new Set(tags).size).toBe(tags.length);
    });
  });
});

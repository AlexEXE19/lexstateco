// Curated collections shown in "Curated for today" on the properties page.
// Each tag's locations are real town names from the seed data (the
// `location` filter matches against Property.location, not neighborhood),
// so whichever tag+location the endpoint hands back is guaranteed to
// return real results when a visitor clicks through to it. There are only
// 4 real towns seeded right now, so "5 locations per tag" isn't honest -
// tags reuse the same towns under different, plausible themes instead.
const locationTags = {
  "Riverside & Historic Homes": ["Rivertown"],
  "Lakeside Retreats": ["Lakeside"],
  "Countryside Escapes": ["Millbrook"],
  "Starter Homes & Downtown Living": ["Springfield"],
  "Family-Friendly Suburbs": ["Springfield", "Rivertown"],
  "Waterfront & Marina Views": ["Lakeside", "Rivertown"],
  "Budget-Friendly Finds": ["Millbrook", "Springfield"],
};

module.exports = locationTags;

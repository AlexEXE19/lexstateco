// "swimmingPool" -> "Swimming Pool" - lets the schema's enum value lists
// double as display labels instead of maintaining a parallel label map.
export const humanizeEnumValue = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

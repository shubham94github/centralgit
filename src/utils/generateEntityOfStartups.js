import { v4 as uuid } from "uuid";

export const generateEntityOfStartups = (
  newStartups,
  ratedStartups,
  relatedStartups
) => [
  {
    id: uuid(),
    value: "Top Rated",
    label: "Top Rated",
    startups: ratedStartups,
    sortData: "A-Z",
  },
  {
    id: uuid(),
    value: "New",
    label: "New",
    startups: newStartups,
    sortData: "Added",
  },
  {
    id: uuid(),
    value: "Related",
    label: "Recommended",
    startups: relatedStartups,
    sortData: "A-Z",
  },
];

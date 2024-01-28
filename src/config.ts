export const config = {
  conferenceTable: process.env.CONFERENCE_TABLE || "mising",
};
export type Config = typeof config;

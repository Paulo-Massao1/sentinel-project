import channelsData from "../data/channels.json";

/** Supported country keys derived from the reporting channels data. */
export type Country = keyof typeof channelsData;

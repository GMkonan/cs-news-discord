import { env } from "~/env.mjs";

export interface DiscordMessageT {
  content: string;
  embeds: Embed[];
}

export interface Embed {
  author: Author;
  title: string;
  description: string;
  fields: Field[];
}

export interface Author {
  name: string;
  url: string;
  icon_url: string;
}

export interface Field {
  name: string;
  value: string;
  inline?: boolean;
}

export const sendDiscordMsg = async (msg: DiscordMessageT) => {
  return await fetch(env.DISCORD_WEBHOOK, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msg),
  });
};

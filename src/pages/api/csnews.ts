import HLTV, { type EventPreview } from "hltv";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";

const sendToDiscord = async (content: EventPreview[]) => {
  const formmatedFirstEvent = {
    title: content[0]?.name,
    date: content[0]?.dateStart,
  };

  const finalContent = `Novo Evento de cesq ${
    formmatedFirstEvent.title || ""
  } vai rolar dia ${
    new Date(formmatedFirstEvent.date || 0).toDateString() || ""
  }`;

  return fetch(env.DISCORD_WEBHOOK, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: finalContent,
    }),
  });
};

const csNews = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = (await HLTV.getEvents()).filter((a) => a.featured === true);

  await sendToDiscord(result);

  return res.status(200).json(result);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default csNews;

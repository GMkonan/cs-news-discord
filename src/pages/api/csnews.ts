import dayjs from "dayjs";
import HLTV, { type EventPreview } from "hltv";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { verifySignature } from "@upstash/qstash/nextjs";

const sendToDiscord = async (content: EventPreview[]) => {
  // seems like the closest event is always the 0 index (thank you hltv)
  const formmatedFirstEvent = {
    title: content[0]?.name,
    date: content[0]?.dateStart,
  };

  const finalContent = `GRITA CHELO! Nossa grande FURIA vai estar na ${
    formmatedFirstEvent.title || ""
  } Data: ${
    dayjs(formmatedFirstEvent.date || 0).format("DD/MM/YYYY") || ""
  } Vamo la apoiar o fall... furia?`;

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
  const team = await HLTV.getTeamByName({ name: "FURIA" }).then(
    (res) => res.id
  );

  const TeamIds = [team];

  const result = await HLTV.getEvents({ attendingTeamIds: TeamIds });

  await sendToDiscord(result);

  return res.status(200).json(result);
};

export default verifySignature(csNews);

// upstash needs access to body
export const config = {
  api: {
    bodyParser: false,
  },
};

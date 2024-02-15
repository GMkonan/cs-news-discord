import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { getTeamNextGameInfo } from "~/utils/getTeamNextGameInfo";
import { type DiscordMessageT, sendDiscordMsg } from "~/utils/sendDiscordMsg";
import { MESSAGE_DATA } from "~/data/message-data";

const csNews = async (req: NextApiRequest, res: NextApiResponse) => {
  // get team name from params
  const { matchDetails, event } = await getTeamNextGameInfo("FURIA");

  if (!matchDetails || !event)
    return res.status(404).json({ message: "No events for this Team" });

  const formmatedFirstEvent = {
    title: event.name,
    dateStart: event.dateStart,
    dateEnd: event.dateEnd,
    team1: matchDetails[0]?.team1?.name || "",
    team2: matchDetails[0]?.team2?.name || "",
    gameFormat: matchDetails[0]?.format || "",
  };

  // could be a "format msg" function or just the value directly
  const message: DiscordMessageT = {
    content: MESSAGE_DATA.content,
    embeds: [
      {
        title: MESSAGE_DATA.title,
        author: {
          // this should be automatically generated
          name: "FURIA",
          url: "https://www.hltv.org/team/8297/furia",
          icon_url:
            "https://img-cdn.hltv.org/teamlogo/mvNQc4csFGtxXk5guAh8m1.svg?ixlib=java-2.1.0&s=11e5056829ad5d6c06c5961bbe76d20c",
        },
        description: `Campeonato **${
          formmatedFirstEvent.title || ""
        }** Data: **${
          dayjs(formmatedFirstEvent.dateStart || 0).format("DD/MM/YYYY") || ""
        }** ate **${dayjs(formmatedFirstEvent.dateEnd || 0).format(
          "DD/MM/YYYY"
        )}**`,
        fields: [
          {
            name: `**Jogo (Formato ${formmatedFirstEvent.gameFormat})**`,
            value: "",
          },
          {
            name: `${formmatedFirstEvent.team1 || "TBD"}`,
            value: "Time 1",
            inline: true,
          },
          {
            name: `${formmatedFirstEvent.team2 || "TBD"}`,
            value: "Time 2",
            inline: true,
          },
        ],
      },
    ],
  };

  await sendDiscordMsg(message);

  return res.status(200).json(message);
};

export default verifySignature(csNews);

// upstash needs access to body
export const config = {
  api: {
    bodyParser: false,
  },
};

import dayjs from "dayjs";
import HLTV, { type MatchPreview, type EventPreview } from "hltv";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { verifySignature } from "@upstash/qstash/nextjs";

const sendToDiscord = async (
  content: EventPreview[],
  matchDetails: MatchPreview[]
) => {
  // seems like the closest event is always the 0 index (thank you hltv)
  const formmatedFirstEvent = {
    title: content[0]?.name,
    dateStart: content[0]?.dateStart,
    dateEnd: content[0]?.dateEnd,
    team1: matchDetails[0]?.team1?.name || "",
    team2: matchDetails[0]?.team2?.name || "",
    gameFormat: matchDetails[0]?.format || "",
  };

  // array with different stuff?
  // const finalContent = `**Compra 2 AWP abre a live que hoje tem clutch do fallen** Nossa FURIA vai estar na **${
  //   formmatedFirstEvent.title || ""
  // }** Data: **${
  //   dayjs(formmatedFirstEvent.dateStart || 0).format("DD/MM/YYYY") || ""
  // }** ate **${dayjs(formmatedFirstEvent.dateEnd || 0).format("DD/MM/YYYY")}** \n
  // Jogo: ${
  //   formmatedFirstEvent.team1
  //     ? `**${formmatedFirstEvent.team1} VS ${formmatedFirstEvent.team2}`
  //     : "**TBD**"
  // } ${formmatedFirstEvent.gameFormat}**
  // Vamo la apoiar o fall... furia?`;

  return fetch(env.DISCORD_WEBHOOK, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "Tá ai as informações do proximo evento:",
      embeds: [
        {
          author: {
            name: "FURIA",
            url: "https://www.hltv.org/team/8297/furia",
            icon_url:
              "https://img-cdn.hltv.org/teamlogo/mvNQc4csFGtxXk5guAh8m1.svg?ixlib=java-2.1.0&s=11e5056829ad5d6c06c5961bbe76d20c",
          },
          title: "Compra 2 AWP abre a live que hoje tem clutch do fallen",
          description: `Nossa FURIA vai estar na **${
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
    }),
  });
};

const csNews = async (req: NextApiRequest, res: NextApiResponse) => {
  const team = await HLTV.getTeamByName({ name: "FURIA" }).then(
    (res) => res.id
  );

  const TeamIds = [team];

  const result = await HLTV.getEvents({ attendingTeamIds: TeamIds });

  const matchDetails = await HLTV.getMatches({
    eventIds: [result[0]?.id as number],
    teamIds: TeamIds,
  });

  await sendToDiscord(result, matchDetails);

  return res.status(200).json(result);
};

export default verifySignature(csNews);

// upstash needs access to body
export const config = {
  api: {
    bodyParser: false,
  },
};

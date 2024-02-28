import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { getTeamNextGameInfo } from "~/utils/getTeamNextGameInfo";
import { sendDiscordMsg } from "~/utils/sendDiscordMsg";
import createMessage from "~/utils/createMessage";

export type FormattedEventT = {
  title: string;
  dateStart: number;
  dateEnd: number;
  team1: string;
  team2: string;
  gameFormat: string;
};

export type TeamT = {
  id: number;
  name: string;
  logo: string | undefined;
  url: string;
};

const csNews = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.team)
    return res.status(404).json({ message: "No team name provided" });

  const teamName = req.query.team as string;
  console.log(teamName);
  // get team name from params
  const { team, matchDetails, event } = await getTeamNextGameInfo(teamName);

  if (!team) return res.status(404).json({ message: "No team found" });

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

  const message = createMessage(team, formmatedFirstEvent);

  return await sendDiscordMsg(message)
    .then(() => res.status(200).json(message))
    .catch((err) => res.status(500).json(err));

  // return res.status(200).json(message);
};

export default verifySignature(csNews);

// upstash needs access to body
export const config = {
  api: {
    bodyParser: false,
  },
};

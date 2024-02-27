import { type TeamT, type FormattedEventT } from "~/pages/api/csnews";
import { type DiscordMessageT } from "./sendDiscordMsg";
import dayjs from "dayjs";

const createMessage = (
  team: TeamT,
  event: FormattedEventT
): DiscordMessageT => {
  return {
    content: "Tá ai as informações do proximo evento:",
    embeds: [
      {
        title: `${team.name} - ${event.title}`,
        author: {
          // this should be automatically generated
          name: team.name.toUpperCase(),
          url: team.url,
          icon_url: team.logo || "",
        },
        description: `Campeonato **${event.title || ""}** Data: **${
          dayjs(event.dateStart || 0).format("DD/MM/YYYY") || ""
        }** ate **${dayjs(event.dateEnd || 0).format("DD/MM/YYYY")}**`,
        fields: [
          {
            name: `**Jogo (Formato ${event.gameFormat})**`,
            value: "",
          },
          {
            name: `${event.team1 || "TBD"}`,
            value: "Time 1",
            inline: true,
          },
          {
            name: `${event.team2 || "TBD"}`,
            value: "Time 2",
            inline: true,
          },
        ],
      },
    ],
  };
};

export default createMessage;

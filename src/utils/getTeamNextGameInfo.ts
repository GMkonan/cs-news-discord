import HLTV from "hltv";

export const getTeamNextGameInfo = async (teamName: string) => {
  const team = await HLTV.getTeamByName({ name: teamName }).then((res) => ({
    id: res.id,
    name: res.name,
    logo: res.logo,
    url: `https://www.hltv.org/team/${res.id}/${res.name}`,
  }));

  const result = await HLTV.getEvents({ attendingTeamIds: [team.id] });

  // Getting first index aka queue style is not the best way
  // but is consistent enough for now
  const latestEvent = result[0];

  if (!latestEvent) return {};

  const matchDetails = await HLTV.getMatches({
    eventIds: [latestEvent.id],
    teamIds: [team.id],
  });
  return {
    team,
    event: latestEvent,
    matchDetails,
  };
};

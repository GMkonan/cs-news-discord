import HLTV from "hltv";

export const getTeamNextGameInfo = async (teamName: string) => {
  const team = await HLTV.getTeamByName({ name: teamName }).then(
    (res) => res.id
  );

  const TeamIds = [team];

  const result = await HLTV.getEvents({ attendingTeamIds: TeamIds });

  // Getting first index aka queue style is not the best way
  // but is consistent enough for now
  const latestEvent = result[0];

  if (!latestEvent) return {};

  const matchDetails = await HLTV.getMatches({
    eventIds: [latestEvent.id],
    teamIds: TeamIds,
  });
  return {
    event: latestEvent,
    matchDetails,
  };
};

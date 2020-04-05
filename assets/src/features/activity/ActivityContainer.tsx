import React from "react";
import { Channel } from "phoenix";
import useActivityChannel from "features/activity/useActivityChannel";
import ActivityChat from "features/activity/components/ActivityChat";
import activityReducer, {
  initialState,
} from "features/activity/ActivityReducer";

type Props = {
  displayName: string;
  teamId: string | null;
};

const ActivityContainer = ({ displayName, teamId }: Props) => {
  console.log("teamId", teamId);
  const { channelState, channel } = useActivityChannel(
    activityReducer,
    initialState,
    displayName,
    teamId || ""
  );

  return (
    <div>
      <h1>In mission</h1>
      <ActivityChat
        channelState={channelState}
        channel={channel}
        displayName={displayName}
      />
    </div>
  );
};

export default ActivityContainer;

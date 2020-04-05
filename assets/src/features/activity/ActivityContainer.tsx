import React from "react";
import { Channel } from "phoenix";
import useActivityChannel from "features/activity/useActivityChannel";
import ActivityChat from "features/activity/components/ActivityChat";
import activityReducer, {
  initialState,
} from "features/activity/ActivityReducer";
import ActivityBriefing from "features/activity/components/ActivityBriefing";
type Props = {
  displayName: string;
  userId: string | null;
  teamId: string | null;
};

const ActivityContainer = ({ displayName, teamId, userId }: Props) => {
  const { channelState, channel } = useActivityChannel(
    activityReducer,
    initialState,
    { name: displayName, id: userId },
    teamId || ""
  );

  return (
    <div>
      <h1>In mission</h1>
      <ActivityBriefing channelState={channelState} channel={channel} />
      <ActivityChat
        channelState={channelState}
        channel={channel}
        displayName={displayName}
      />
    </div>
  );
};

export default ActivityContainer;

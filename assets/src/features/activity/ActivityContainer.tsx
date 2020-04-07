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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridColumnGap: "10px",
          gridRowGap: "15px",
        }}
      >
        <ActivityBriefing
          channelState={channelState}
          channel={channel}
          userId={userId}
        />
        <ActivityChat
          channelState={channelState}
          channel={channel}
          displayName={displayName}
        />
      </div>
    </div>
  );
};

export default ActivityContainer;

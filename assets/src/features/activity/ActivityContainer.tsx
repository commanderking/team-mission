import React, { useEffect } from "react";
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
    `room:${teamId}`,
    activityReducer,
    initialState,
    { name: displayName, id: userId, teamId }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "4fr 4fr",
        gridTemplateRows: "800px",
        gridColumnGap: "10px",
        gridRowGap: "15px",
        padding: "50px",
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
  );
};

export default ActivityContainer;

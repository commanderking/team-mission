import React from "react";
import parse from "html-react-parser";
import { List, Button } from "antd";
import { Channel } from "phoenix";
import { ActivityState } from "features/activity/ActivityTypes";

const sampleActivityData = {
  title: "Unknown Compound Toxicity",
  description:
    "Analysis of the local water has revealed five major compounds present in the water.",
  answers: [
    {
      id: "answer1",
      text: "Pb(NO<sub>3</sub>)<sub>2</sub>",
    },
    {
      id: "answer2",
      text: "PbCl<sub>2</sub>",
    },
    {
      id: "answer3",
      text: "PbSO<sub>4</sub>",
    },
    {
      id: "answer4",
      text: "Pb(C<sub>2</sub>H<sub>3</sub>O<sub>2</sub>)<sub>2</sub>",
    },
  ],
};

type Props = {
  channel: Channel | null;
  channelState: ActivityState;
};

const handleVote = (channel: Channel | null, itemId: string) => {
  channel?.push("vote", { id: itemId });
};

const ActivityBriefing = ({ channel, channelState }: Props) => {
  return (
    <List
      dataSource={sampleActivityData.answers}
      renderItem={(item, index) => {
        return (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={`Task ${index + 1}`}
              description={parse(item.text)}
            />
            <Button
              onClick={() => {
                handleVote(channel, item.id);
              }}
            >
              Vote
            </Button>
          </List.Item>
        );
      }}
    ></List>
  );
};

export default ActivityBriefing;

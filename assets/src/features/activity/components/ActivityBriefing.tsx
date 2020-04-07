import React from "react";
import parse from "html-react-parser";
import { List, Button } from "antd";
import { Channel } from "phoenix";
import { ActivityState, Member } from "features/activity/ActivityTypes";

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
  userId: string | null;
};

const handleVote = (channel: Channel | null, itemId: string) => {
  channel?.push("vote", { id: itemId });
};

const appendVotesToAnswers = (
  answers: { id: string; text: string }[],
  members: Member[]
) => {
  return answers.map((answer) => {
    const membersVotingForAnswer = members.map((member) => {
      if (member.votedAnswerId === answer.id) {
        return member.name;
      }
      return null;
    });

    return {
      ...answer,
      votes: membersVotingForAnswer.filter(Boolean),
    };
  });
};

const getUserVoteAnswerId = (userId: string | null, members: Member[]) => {
  const currentUser = members.find((member) => {
    return member.id === userId;
  });

  return currentUser?.votedAnswerId;
};

const ActivityBriefing = ({ channel, channelState, userId }: Props) => {
  const { members } = channelState;

  const answersWithVotes = appendVotesToAnswers(
    sampleActivityData.answers,
    members
  );

  const currentUserAnswerId = getUserVoteAnswerId(userId, members);

  console.log("members", members);

  console.log("answersWithVotes", answersWithVotes);
  return (
    <List
      dataSource={answersWithVotes}
      renderItem={(item, index) => {
        return (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={`Task ${index + 1}`}
              description={parse(item.text)}
            />
            {item.votes.map((vote) => {
              return <div>{vote}</div>;
            })}
            {currentUserAnswerId !== item.id && (
              <Button
                onClick={() => {
                  handleVote(channel, item.id);
                }}
              >
                Vote
              </Button>
            )}
          </List.Item>
        );
      }}
    ></List>
  );
};

export default ActivityBriefing;

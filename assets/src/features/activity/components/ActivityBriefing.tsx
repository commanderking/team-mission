import React from "react";
import parse from "html-react-parser";
import { Card, Button, Table, Tag } from "antd";
import { Channel } from "phoenix";
import { ActivityState, Member } from "features/activity/ActivityTypes";
import { CheckCircleTwoTone } from "@ant-design/icons";

const sampleActivityData = {
  title: "Extracting Lead",
  description:
    "From which of the following compounds, could we extract the most lead atoms?",
  answers: [
    {
      id: "answer1",
      text: "26g Pb(NO<sub>3</sub>)<sub>2</sub>",
    },
    {
      id: "answer2",
      text: "5.0g PbCl<sub>2</sub>",
    },
    {
      id: "answer3",
      text: "32g PbSO<sub>4</sub>",
    },
    {
      id: "answer4",
      text: "7.25g Pb(C<sub>2</sub>H<sub>3</sub>O<sub>2</sub>)<sub>2</sub>",
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

const getColumns = (
  channel: Channel | null,
  currentUserAnswerId: string | undefined
) => [
  {
    title: "Choices",
    dataIndex: "text",
    key: "text",
    render: (text: string) => parse(text),
  },
  {
    title: "Votes",
    dataIndex: "votes",
    key: "votes",
    render: (text: string, record: any) => {
      return (
        <div>
          {record.votes.map((vote: string) => {
            return (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "30px" }}
              />
            );
          })}
        </div>
      );
    },
  },
  {
    title: "",
    dataIndex: "id",
    key: "id",
    width: 65,
    render: (text: string, record: any) => {
      return (
        <Button
          disabled={currentUserAnswerId === record.id}
          onClick={() => {
            handleVote(channel, record.id);
          }}
        >
          Vote
        </Button>
      );
    },
  },
];

const ActivityBriefing = ({ channel, channelState, userId }: Props) => {
  const { members } = channelState;

  const answersWithVotes = appendVotesToAnswers(
    sampleActivityData.answers,
    members
  );

  const currentUserAnswerId = getUserVoteAnswerId(userId, members);
  return (
    <Card title={sampleActivityData.title}>
      <h3 style={{ textAlign: "left" }}>{sampleActivityData.description}</h3>
      <Table
        dataSource={answersWithVotes}
        columns={getColumns(channel, currentUserAnswerId)}
        pagination={false}
      />
      <Card>
        <h3>Team Members</h3>
        {members.map((member) => (
          <Tag
            style={{ padding: "10px", fontSize: "20px", borderRadius: "30px" }}
          >
            {member.name}
          </Tag>
        ))}
      </Card>
    </Card>
  );
};

export default ActivityBriefing;

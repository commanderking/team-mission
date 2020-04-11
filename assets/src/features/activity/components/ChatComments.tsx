import React from "react";
import { Card, Comment, Avatar } from "antd";
import { Message } from "features/activity/ActivityTypes";
import { UserOutlined } from "@ant-design/icons";

type Props = {
  messages: Message[];
};

const ChatComments = ({ messages }: Props) => {
  return (
    <Card
      style={{ height: "550px", marginBottom: "25px", overflowY: "scroll" }}
    >
      {messages.map((message: Message, index: number) => {
        return (
          <Comment
            key={`chat-message-${index}`}
            author={<a>{message.name}</a>}
            avatar={<Avatar icon={<UserOutlined />} />}
            content={<p>{message.text}</p>}
          />
        );
      })}
    </Card>
  );
};

export default ChatComments;

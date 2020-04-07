import React, { useState } from "react";
import { ActivityState } from "features/activity/ActivityTypes";
import { Form, Input, Button, Card, Comment, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Message } from "features/activity/ActivityTypes";
const Messages = ({
  channelState,
  channel,
  displayName,
}: {
  channelState: ActivityState;
  channel: any;
  displayName: string;
}) => {
  const { messages } = channelState;
  const [form] = Form.useForm();

  return (
    <div>
      <Card title="Team Chat">
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
        <Form
          form={form}
          name="basic"
          onFinish={(formValues) => {
            channel.push("new_msg", {
              text: formValues.text,
              name: displayName,
            });

            form.resetFields(["text"]);
          }}
        >
          <Form.Item
            label="Message"
            name="text"
            rules={[{ required: true, message: "Please input some text." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Messages;

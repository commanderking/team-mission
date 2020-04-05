import React, { useState } from "react";
import { ActivityState } from "features/activity/ActivityTypes";
import { Form, Input, Button, Card, Comment, Avatar } from "antd";

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
      <Card title="Team Chat" style={{ width: "500px", margin: "auto" }}>
        <div>
          {messages.map((message: any, index: any) => {
            return (
              <Comment
                key={`chat-message-${index}`}
                author={<a>{displayName}</a>}
                avatar={<Avatar>{displayName}</Avatar>}
                content={<p>{message}</p>}
              />
            );
          })}
        </div>
        <Form
          form={form}
          name="basic"
          onFinish={(formValues) => {
            console.log("formValues", formValues);
            channel.push("new_msg", {
              text: formValues.text,
              name: displayName,
            });

            form.resetFields(["text"]);
          }}
        >
          <Form.Item
            label="Text"
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

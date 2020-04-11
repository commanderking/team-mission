import React from "react";
import { ActivityState } from "features/activity/ActivityTypes";
import { Form, Input, Button, Card } from "antd";
import ChatComments from "features/activity/components/ChatComments";

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
        <ChatComments messages={messages} />
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

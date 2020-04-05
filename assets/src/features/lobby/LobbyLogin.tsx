import React, { useState } from "react";
import LobbyContainer from "features/lobby/LobbyContainer";
import { Form, Input, Button, Card } from "antd";

const LobbyLogin = () => {
  const [displayName, setDisplayName]: [string, any] = useState("");
  return (
    <div>
      <h1>Team Mission</h1>
      {!displayName && (
        <Card style={{ width: "500px", margin: "auto" }}>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={(formValues) => {
              console.log("formValues", formValues);
              setDisplayName(formValues.name);
            }}
          >
            <Form.Item
              label="Display Name"
              name="name"
              rules={[
                { required: true, message: "Please input a display name." },
              ]}
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
      )}

      {displayName && <LobbyContainer displayName={displayName} />}
    </div>
  );
};

export default LobbyLogin;

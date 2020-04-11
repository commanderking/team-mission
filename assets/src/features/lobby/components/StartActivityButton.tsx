import React from "react";
import { Button } from "antd";
import { Channel } from "phoenix";

type Props = {
  channel: Channel;
};

const StartActivityButton = ({ channel }: Props) => {
  const isAdmin = window.location.href.includes("admin");

  if (!isAdmin) return null;

  return (
    <Button
      type="primary"
      onClick={() => {
        channel?.push("start_activity", {});
      }}
    >
      Start Activity
    </Button>
  );
};

export default StartActivityButton;

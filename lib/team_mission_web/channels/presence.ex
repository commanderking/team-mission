defmodule TeamMissionWeb.Presence do
  use Phoenix.Presence, otp_app: :team_mission, pubsub_server: TeamMission.PubSub
end

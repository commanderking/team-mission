defmodule TeamMission.Repo do
  use Ecto.Repo,
    otp_app: :team_mission,
    adapter: Ecto.Adapters.Postgres
end

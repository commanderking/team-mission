use Mix.Config

# Configure your database
config :team_mission, TeamMission.Repo,
  username: "postgres",
  password: "postgres",
  database: "team_mission_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :team_mission, TeamMissionWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

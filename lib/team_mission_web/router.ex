defmodule TeamMissionWeb.Router do
  use TeamMissionWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", TeamMissionWeb do
    pipe_through :api
  end
end

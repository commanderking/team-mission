defmodule TeamMissionWeb.TeamChannel do
  use Phoenix.Channel

  def join("team:lobby", message, socket) do
    name = message["params"]["name"]
    uuid = Ecto.UUID.generate()
    {:ok, %{name: "name"}, assign(socket, :user_data, %{name: name, uuid: uuid})}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_join", _params, socket) do
    {:noreply, socket}
  end
end

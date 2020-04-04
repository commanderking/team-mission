import Ecto

defmodule TeamMissionWeb.RoomChannel do
  use Phoenix.Channel
  alias TeamMissionWeb.Presence

  def join("room:lobby", message, socket) do
    name = message["params"]["name"]
    uuid = Ecto.UUID.generate()

    send(self(), :after_join)

    {:ok, %{name: "name", users: Presence.list(socket)},
     assign(socket, :user_data, %{name: name, uuid: uuid})}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_join", _params, socket) do
    uuid = socket.assigns[:user_data][:uuid]
    name = socket.assigns[:user_data][:name]
    # broadcast!(socket, "new_join", %{user_data: %{name: name, uuid: uuid}})
    {:noreply, socket}
  end

  def handle_in("new_msg", %{"text" => text}, socket) do
    name = socket.assigns[:user_data][:name]
    broadcast!(socket, "new_msg", %{text: text, name: name})
    {:noreply, socket}
  end

  def handle_in("join_team", params, socket) do
    broadcast!(socket, "join_team", %{
      teamId: params["teamId"],
      userName: params["userName"],
      userId: params["userId"]
    })

    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    name = socket.assigns[:user_data][:name]
    uuid = socket.assigns[:user_data][:uuid]
    push(socket, "current_user_info", %{id: uuid, name: name})
    broadcast!(socket, "after_join", %{id: uuid, name: name})

    # {:ok, _} =
    #   Presence.track(socket, "user", %{
    #     name: name,
    #     uuid: uuid
    #   })

    {:noreply, socket}
  end
end

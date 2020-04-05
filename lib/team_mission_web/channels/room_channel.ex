require Logger
import Ecto

defmodule TeamMissionWeb.RoomChannel do
  use Phoenix.Channel
  alias TeamMissionWeb.Presence

  def join("room:lobby", message, socket) do
    name = message["params"]["name"]
    id = Ecto.UUID.generate()

    send(self(), :after_join)

    {:ok, %{name: "name", users: Presence.list(socket)},
     assign(socket, :user_data, %{name: name, id: id})}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_join", _params, socket) do
    id = socket.assigns[:user_data][:id]
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
    assign(socket, :user_data, %{teamId: params["teamId"]})

    name = socket.assigns[:user_data][:name]
    id = socket.assigns[:user_data][:id]

    Presence.update(socket, "students", %{
      name: name,
      id: id,
      teamId: params["teamId"]
    })

    {:noreply, socket}
  end

  def handle_in("leave_team", _params, socket) do
    # assign(socket, :user_data, %{teamId: nil})

    name = socket.assigns[:user_data][:name]
    id = socket.assigns[:user_data][:id]

    # teamId = socket.assigns[:user_data][:teamId]

    Presence.update(socket, "students", %{
      name: name,
      id: id,
      teamId: nil
    })

    # broadcast!(socket, "leave_team", %{
    #   teamId: teamId,
    #   userName: name,
    #   userId: id
    # })

    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    name = socket.assigns[:user_data][:name]
    id = socket.assigns[:user_data][:id]

    push(socket, "after_join", %{
      current_user: %{id: id, name: name}
    })

    push(socket, "presence_state", Presence.list(socket))

    {:ok, _} =
      Presence.track(socket, "students", %{
        name: name,
        id: id,
        teamId: nil
      })

    # broadcast!(socket, "after_join", %{id: uuid, name: name, presence: Presence.list(socket)})

    {:noreply, socket}
  end
end

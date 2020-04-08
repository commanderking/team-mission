require Logger
import Ecto

defmodule TeamMissionWeb.RoomChannel do
  use Phoenix.Channel
  alias TeamMissionWeb.Presence
  alias TeamMissionWeb.Messages

  def join("room:lobby", message, socket) do
    name = message["params"]["name"]
    id = Ecto.UUID.generate()

    send(self(), :after_join)

    {:ok, %{name: "name", users: Presence.list(socket)},
     assign(socket, :user_data, %{name: name, id: id})}
  end

  def join("room:" <> room_id, message, socket) do
    name = message["params"]["name"]
    id = message["params"]["id"]

    send(self(), :after_activity_join)

    {:ok, assign(socket, :user_data, %{name: name, id: id, room_id: room_id})}
  end

  def handle_in("new_msg", payload, socket) do
    "room:" <> room = socket.topic
    payload = Map.merge(payload, %{"room" => room})
    room_id = socket.assigns.user_data.room_id

    Messages.add_message(payload, room_id)

    broadcast!(socket, "new_msg", payload)
    {:noreply, socket}
  end

  def handle_in("join_team", params, socket) do
    assign(socket, :user_data, %{teamId: params["teamId"]})

    name = socket.assigns.user_data.name
    id = socket.assigns.user_data.id

    Presence.update(socket, "students", %{
      name: name,
      id: id,
      teamId: params["teamId"]
    })

    {:noreply, socket}
  end

  def handle_in("leave_team", _params, socket) do
    name = socket.assigns[:user_data][:name]
    id = socket.assigns[:user_data][:id]

    Presence.update(socket, "students", %{
      name: name,
      id: id,
      teamId: nil
    })

    {:noreply, socket}
  end

  def handle_in("start_activity", _params, socket) do
    broadcast!(socket, "start_activity", %{})
    {:noreply, socket}
  end

  def handle_in("vote", %{"id" => voteId}, socket) do
    name = socket.assigns[:user_data][:name]
    id = socket.assigns[:user_data][:id]

    Presence.update(socket, "team", %{
      name: name,
      id: id,
      votedAnswerId: voteId
    })

    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    name = socket.assigns.user_data.name
    id = socket.assigns.user_data.id

    push(socket, "after_join", %{
      current_user: %{id: id, name: name}
    })

    {:ok, _} =
      Presence.track(socket, "students", %{
        name: name,
        id: id,
        teamId: nil
      })

    push(socket, "presence_state", Presence.list(socket))

    {:noreply, socket}
  end

  def handle_info(:after_activity_join, socket) do
    name = socket.assigns.user_data.name
    room_id = socket.assigns.user_data.room_id

    Messages.initiate_room_messages(room_id)

    {:ok, _} =
      Presence.track(socket, "team", %{
        name: name,
        task: [],
        vote: nil
      })

    push(socket, "presence_state", Presence.list(socket))
    push(socket, "get_room_messages", %{messages: Enum.reverse(Messages.get_messages(room_id))})

    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    Presence.list(socket) |> inspect() |> Logger.debug()

    presences = Presence.list(socket)

    if Map.has_key?(presences, "students") &&
         presences["students"].metas |> Kernel.length() == 1 do
      Messages.reset_messages()
    end
  end
end

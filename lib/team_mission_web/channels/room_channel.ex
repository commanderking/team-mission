require Logger

defmodule TeamMissionWeb.RoomChannel do
  use Phoenix.Channel
  alias TeamMissionWeb.Presence
  alias TeamMissionWeb.Messages

  def join("room:lobby", %{"params" => %{"name" => name}}, socket) do
    id = Ecto.UUID.generate()

    send(self(), :after_join)

    {:ok, assign(socket, :user_data, %{name: name, id: id})}
  end

  def join("room:" <> room_id, %{"params" => %{"name" => name, "id" => id}}, socket) do
    send(self(), :after_activity_join)
    {:ok, assign(socket, :user_data, %{name: name, id: id, room_id: room_id})}
  end

  def handle_in("new_msg", payload, socket) do
    "room:" <> room = socket.topic

    Messages.add_message(payload, room)

    broadcast!(socket, "new_msg", payload)
    {:noreply, socket}
  end

  def handle_in("join_team", %{"teamId" => teamId}, socket) do
    name = socket.assigns.user_data.name
    id = socket.assigns.user_data.id

    Presence.update(socket, "students", %{
      name: name,
      id: id,
      teamId: teamId
    })

    {:noreply, assign(socket, :user_data, %{teamId: teamId})}
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
    Presence.update(socket, "team", %{
      name: socket.assigns[:user_data][:name],
      id: socket.assigns[:user_data][:id],
      votedAnswerId: voteId
    })

    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    %{:user_data => %{:name => name, :id => id}} = socket.assigns

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

    push(socket, "get_room_messages", %{
      messages: room_id |> Messages.get_messages() |> Enum.reverse()
    })

    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    presences = Presence.list(socket)

    if Map.has_key?(presences, "students") &&
         presences["students"].metas |> Kernel.length() == 1 do
      Messages.reset_messages()
    end
  end
end

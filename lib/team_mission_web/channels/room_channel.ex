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

  def join("room:" <> _private_room_id, message, socket) do
    name = message["params"]["name"]
    id = message["params"]["id"]

    send(self(), :after_activity_join)

    {:ok, assign(socket, :user_data, %{name: name, id: id})}
  end

  def handle_in("new_msg", payload, socket) do
    "room:" <> room = socket.topic
    payload = Map.merge(payload, %{"room" => room})
    broadcast!(socket, "new_msg", payload)
    {:noreply, socket}
  end

  # Useful if want to stream the users joining - otherwise can use presence to sync
  # def handle_in("new_join", _params, socket) do
  #   id = socket.assigns[:user_data][:id]
  #   name = socket.assigns[:user_data][:name]
  #   broadcast!(socket, "new_join", %{user_data: %{name: name, uuid: uuid}})
  #   {:noreply, socket}
  # end

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

  def handle_in("vote", params, socket) do
    Presence.update(socket, "team", %{
      vote: params["id"]
    })

    {:noreply, socket}
  end

  @spec handle_info(:after_activity_join | :after_join, Phoenix.Socket.t()) ::
          {:noreply, Phoenix.Socket.t()}
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

    {:noreply, socket}
  end

  def handle_info(:after_activity_join, socket) do
    name = socket.assigns[:user_data][:name]
    socket.assigns |> inspect() |> Logger.debug()
    Logger.info(name)

    {:ok, _} =
      Presence.track(socket, "team", %{
        name: name,
        task: [],
        vote: ""
      })

    push(socket, "presence_state", Presence.list(socket))

    {:noreply, socket}
  end
end

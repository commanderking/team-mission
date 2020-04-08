require Logger

defmodule TeamMissionWeb.Messages do
  use Agent

  def start_link(initial_state) do
    Agent.start_link(fn -> initial_state end, name: __MODULE__)
  end

  def initiate_room_messages(room) do
    Agent.update(__MODULE__, fn state ->
      if Map.has_key?(state, room) do
        state
      else
        Map.put(state, room, [])
      end
    end)
  end

  def add_message(message, room) do
    Agent.update(__MODULE__, fn state ->
      room_messages = [message | state[room]]
      Map.put(state, room, room_messages)
    end)
  end

  def get_messages(room) do
    Agent.get(__MODULE__, fn state -> state[room] end)
  end

  def reset_messages() do
    Agent.update(__MODULE__, fn _state ->
      %{}
    end)
  end
end

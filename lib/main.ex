defmodule TheTragedyOfTheCommons.Main do
  alias TheTragedyOfTheCommons.Host
  alias TheTragedyOfTheCommons.Participant

  def init do
    %{
      page: "waiting",
      joinable: true,
      message: %{
         description: [
           %{id: 0, text: "A"},
           %{id: 1, text: "B"},
         ],
      },
      groups: %{},
      participants: %{},
      participants_number: 0,
      active_participants_number: 0,
      group_size: 4, # Number of members
      groups_number: 0,
      max_grazing_num: 3,
      cost: 2,
      capacity: 16,
      max_round: 4,
    }
  end

  def new_participant do
    %{
      is_finish_description: false,
      id: nil,
      profit: 0,
      grazingNum: 0,
      status: "waiting",
      group: nil,
    }
  end

  def new_group(members) do
    %{
      members: members,
      state: "waiting",
    }
  end

  def join(data, id) do
    unless Map.has_key?(data.participants, id) do
      new = new_participant()
      if data.page == "waiting" do
        data = Map.update!(data, :active_participants_number, fn n -> n + 1 end)
      end

      data
      |> put_in([:participants, id], new)
      |> Map.update!(:participants_number, fn n -> n + 1 end)
    else
      data
    end
  end

  def compute_diff(old, %{data: new} = result) do
    host = Map.get(result, :host, %{})
    participant = Map.get(result, :participant, %{})
    diff = JsonDiffEx.diff(old, new)
    participant_tasks = Enum.map(old.participants, fn {id, _} ->
      {id, Task.async(fn -> Participant.filter_diff(new, diff, id) end)}
    end)
    host_task = Task.async(fn -> Host.filter_diff(new, diff) end)
    host_diff = Task.await(host_task)
    participant_diff = Enum.map(participant_tasks, fn {id, task} -> {id, %{diff: Task.await(task)}} end)
                        |> Enum.filter(fn {_, map} -> map_size(map.diff) != 0 end)
                        |> Enum.into(%{})
    host = Map.merge(host, %{diff: host_diff})
    host = if map_size(host.diff) == 0 do
      Map.delete(host, :diff)
    else
      host
    end
    host = if map_size(host) == 0 do
      nil
    else
      host
    end
    participant = Map.merge(participant, participant_diff, fn _k, v1, v2 ->
      Map.merge(v1, v2)
    end)
    %{data: new, host: host, participant: participant}
  end
end

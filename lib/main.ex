defmodule TragedyOfTheCommons.Main do
  alias TragedyOfTheCommons.Host
  alias TragedyOfTheCommons.Participant

  require Logger

  def init do
    %{
      page: "waiting",
      joinable: true,
      description: [
        %{id: 0, text: "数件の農家が山の中に共同で土地を持っているとします。"},
        %{id: 1, text: "その共有地には牧草がよく茂っていて、そこには、自由に放牧することが出来ます。"},
        %{id: 2, text: "いま、4件の農家が放牧を希望しているとし、各農家は3頭までの仔牛を買うことが出来ます。"},
        %{id: 3, text: "たくさんの牛が放牧されると、それだけ牛の生育が悪くなり、牛からの収益が落ちます。"},
        %{id: 4, text: "あなたは、農家の1人として、何頭の牛を放牧するかを選択してください。"},
      ],
      groups: %{},
      participants: %{},
      participants_number: 0,
      active_participants_number: 0,
      finish_description_number: 0,
      group_size: 4, # Number of members
      groups_number: 0,
      max_grazing_num: 3,
      cost: 2,
      capacity: 16,
      max_round: 4,
      ask_student_id: false,
      results: %{
        groups: %{},
        participants: %{},
      },
    }
  end

  def new_participant(uid) do
    %{
      is_finish_description: false,
      id: nil,
      uid: uid,
      profits: [],
      grazings: [],
      status: "waiting",
      group: nil,
      answered: false,
      confirmed: false,
    }
  end

  def new_group(members) do
    %{
      members: members,
      group_status: "playing",
      group_profits: [],
      confirming: false,
      round: 0,
    }
  end

  def join(data, id) do
    unless Map.has_key?(data.participants, id) do
      new = new_participant(id)
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
    import Participant, only: [filter_data: 2]
    import Host, only: [filter_data: 1]

    host = Map.get(result, :host, %{})
    participant = Map.get(result, :participant, %{})
    participant_tasks = Enum.map(old.participants, fn {id, _} ->
      {id, Task.async(fn -> JsonDiffEx.diff(filter_data(old, id), filter_data(new, id)) end)}
    end)
    host_task = Task.async(fn -> JsonDiffEx.diff(filter_data(old), filter_data(new)) end)
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

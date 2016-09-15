defmodule TheTragedyOfTheCommons.Host do
  alias TheTragedyOfTheCommons.Main

  def change_page(data, page) do
    data = Map.update!(data, :page, fn _ -> page end)
    case page do
      "waiting" -> Map.update!(data, :joinable, fn _ -> true end)
                    |> Map.update!(:active_participants_number, fn _ -> data.participants_number end)
      "description" -> match(data)
      _ -> data
    end
  end

  def match(data) do
    %{participants: participants, group_size: group_size} = data

    groups_number = div(Map.size(participants), group_size)
    groups = participants
              |> Enum.map(&elem(&1, 0)) # [id...]
              |> Enum.shuffle
              |> Enum.map_reduce(0, fn(p, acc) -> {{acc, p}, acc + 1} end) |> elem(0) # [{0, p0}, ..., {n-1, pn-1}]
              |> Enum.group_by(fn {i, p} -> Integer.to_string(min(div(i, group_size), groups_number - 1)) end, fn {i, p} -> p end) # %{0 => [p0, pm-1], ..., l-1 => [...]}

    updater = fn participant, group ->
      %{ participant |
        group: group,
        profit: 0,
      }
    end
    reducer = fn {group, ids}, {participants, groups} ->
      participants = Enum.reduce(ids, participants, fn id, participants ->
        Map.update!(participants, id, &updater.(&1, group))
      end)
    groups = Map.put(groups, group, Main.new_group(ids))
    {participants, groups}
    end
    acc = {participants, %{}}
    {participants, groups} = Enum.reduce(groups, acc, reducer)

    %{data | participants: participants, groups: groups, groups_number: groups_number, active_participants_number: data.participants_number, joinable: false}
  end

  def get_filter(data) do
    map = %{
      _default: true,
      participants_number: "participantsNumber",
      active_participants_number: "activeParticipantsNumber",
      groups_number: "groupsNumber",
    }
  end

  def filter_data(data) do
    Transmap.transform(data, get_filter(data), diff: false)
  end

  def filter_diff(data, diff) do
    Transmap.transform(diff, get_filter(data), diff: true)
  end
end

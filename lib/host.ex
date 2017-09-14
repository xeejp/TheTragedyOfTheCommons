defmodule TragedyOfTheCommons.Host do
  alias TragedyOfTheCommons.Main

  defp ensure_integer(integer) when is_integer(integer), do: integer
  defp ensure_integer(str), do: Integer.parse(str) |> elem(0)

  def update_config(data, config) do
    data = Map.put(data, :capacity, ensure_integer(config["capacity"]))
            |> Map.put(:cost, ensure_integer(config["cost"]))
            |> Map.put(:group_size, ensure_integer(config["groupSize"]))
            |> Map.put(:max_grazing_num, ensure_integer(config["maxGrazingNum"]))
            |> Map.put(:max_round, ensure_integer(config["maxRound"]))
            |> Map.put(:ask_student_id, config["askStudentId"])
  end

  def update_description(data, description) do
    data = Map.put(data, :description, description)
  end

  def change_page(data, page) do
    if data.page == "waiting" && page == "description" do
      data = Map.update!(data, :results, fn _ -> %{ groups: %{}, participants: %{} } end)
             |> Map.update!(:profits_data, fn _ -> [] end)
             |> Map.update!(:history, fn _ -> [] end)
             |> match()
    end
    data = Map.update!(data, :page, fn _ -> page end)
    case page do
      "waiting" -> Map.update!(data, :joinable, fn _ -> true end)
                    |> Map.update!(:active_participants_number, fn _ -> data.participants_number end)
      _ -> data
    end
  end

  def visit(data) do
    Map.put(data, :is_first_visit, false)
  end

  def match(data) do
    %{participants: participants, group_size: group_size} = data

    groups_number = round(Float.ceil(Map.size(participants)/group_size))
    groups = participants
              |> Enum.map(&elem(&1, 0)) # [id...]
              |> Enum.shuffle
              |> Enum.map_reduce(0, fn(p, acc) -> {{acc, p}, acc + 1} end) |> elem(0) # [{0, p0}, ..., {n-1, pn-1}]
              |> Enum.group_by(fn {i, p} -> Integer.to_string(div(i, group_size)) end, fn {i, p} -> p end) # %{0 => [p0, pm-1], ..., l-1 => [...]}

    updater = fn participant, group ->
      %{ participant |
        group: group,
        answered: false,
        confirmed: false,
        is_finish_description: false,
        profits: [],
        grazings: [],
        answers: 0,
        confirms: 0,
        status: "experiment"
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

    %{data | participants: participants, groups: groups, groups_number: groups_number, active_participants_number: data.participants_number, joinable: false, results: %{participants: %{}, groups: %{}}
  }
  end

  def get_filter(data) do
    map = %{
      _default: true,
      is_first_visit: "isFirstVisit",
      participants_number: "participantsNumber",
      active_participants_number: "activeParticipantsNumber",
      finish_description_number: "finishDescriptionNumber",
      groups_number: "groupsNumber",
      group_size: "groupSize",
      max_round: "maxRound",
      max_grazing_num: "maxGrazingNum",
      ask_student_id: "askStudentId",
      profits_data: "profits_data",
      groups: %{
        _default: %{
          _default: true,
          group_status: "groupStatus",
          group_profits: "groupProfits",
        }
      }
    }
  end

  def filter_data(data) do
    Transmap.transform(data, get_filter(data), diff: false)
  end
end

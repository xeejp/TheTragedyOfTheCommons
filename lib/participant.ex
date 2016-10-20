defmodule TragedyOfTheCommons.Participant do
  def finish_description(data, id) do
    update_in(data, [:participants, id, :is_finish_description], fn _ -> true end)
      |> update_in([:finish_description_number], fn prev -> prev + 1 end)
  end

  def update_snum(data, id, snum) do
    update_in(data, [:participants, id, :id], fn _ -> snum end)
  end

  def update_grazing(data, id, num) do
    data = put_in(data, [:participants, id, :grazings], List.insert_at(data.participants[id].grazings, -1, num))
            |> put_in([:participants, id, :answered], true)

    participants = data.participants
    participant = participants[id]
    group_id = participant.group
    group = data.groups[group_id]
    members = Enum.reduce(group.members, [], fn i, acc -> List.insert_at(acc, -1, participants[i]) end)

    if Enum.all?(members, fn(p) -> p.answered end) do
      #grazing = Enum.at(participant.grazings, data.round)
      #profit  = (grazings * (data.capacity - sum)) - (data.cost * grazings)
      #        = grazings * (data.capacity - sum - data.cost)
      sum = Enum.reduce(members, 0, fn(p, acc) -> Enum.at(p.grazings, group.round) + acc end)
      data = Enum.reduce(group.members, data, fn i, acc -> put_in(acc, [:participants, i, :profits], List.insert_at(participants[i].profits, -1, (Enum.at(participants[i].grazings, group.round) * (data.capacity - sum - data.cost)))) end)

      data = put_in(data, [:groups, group_id, :group_profits], List.insert_at(group.group_profits, -1, (data.capacity - sum - data.cost) * sum))
      if group.round < data.max_round - 1 do
        # round end
        data = Enum.reduce(group.members, data, fn i, acc -> put_in(acc, [:participants, i, :answered], false) end)
                |> update_in([:groups, group_id, :round], fn (x) -> x + 1 end)
      else
        # game end
        results = Enum.reduce(group.members, data.results.participants, fn i, acc -> Map.put(acc, i, participants[i].grazings) end)
        data = put_in(data, [:groups, group_id, :group_status], "result")
                |> put_in([:results, :participants], results)
        data = put_in(data, [:results, :groups], data.groups)
      end
    end
    data
  end

  def get_filter(data, id) do
    group_id = data.participants[id].group
    status = if group_id, do: get_in(data, [:groups, group_id, :group_status]), else: nil
    if (data.page == "result"), do: status = "result"
    %{
      _default: true,
      participants: %{
        id => true
      },
      participants_number: "participantsNumber",
      max_grazing_num: "maxGrazingNum",
      groups_number: false,
      group_size: "groupSize",
      groups: %{
        group_id => %{
          _default: true,
          group_status: "groupStatus",
          group_profits: "groupProfits",
        }
      },
      max_round: "maxRound",
      max_grazing_num: "maxGrazingNum",
      ask_student_id: "askStudentId",
      results: status == "result",
      _spread: [[:participants, id], [:groups, group_id]]
    }
  end

  def filter_data(data, id) do
    Transmap.transform(data, get_filter(data, id), diff: false)
    |> Map.delete(:participants)
  end
end


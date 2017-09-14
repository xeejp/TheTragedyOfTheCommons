defmodule TragedyOfTheCommons.Participant do
	require Logger
	def finish_description(data, id) do
		data = update_in(data, [:participants, id, :is_finish_description], fn _ -> true end)
		Map.put(data, :finish_description_number, Enum.count(data.participants, &(elem(&1, 1).is_finish_description)))
	end

	def update_snum(data, id, snum) do
		update_in(data, [:participants, id, :id], fn _ -> snum end)
	end

	def update_grazing(data, id, num) do
		false = data.participants[id].answered
		data = put_in(data, [:participants, id, :grazings], List.insert_at(data.participants[id].grazings, -1, num))
						|> put_in([:participants, id, :answered], true)

		group_id = data.participants[id].group
		group = data.groups[group_id]
		members = Enum.reduce(group.members, [], fn i, acc -> List.insert_at(acc, -1, data.participants[i]) end)
		answers = data.participants[id].answers + 1
		data = Enum.reduce(group.members, data, fn i, acc ->
			put_in(acc,[:participants, i, :answers],answers)
		end)

		history = %{
			id: id,
			grazings: num,
			group_id: group_id,
			round: group.round,
		}
		data = Map.put(data, :history, [history] ++ data.history)

		if Enum.all?(members, fn(p) -> p.answered end) do
			#grazing = Enum.at(participant.grazings, data.round)
			#profit  = (grazings * (data.capacity - sum)) - (data.cost * grazings)
			#        = grazings * (data.capacity - sum - data.cost)
			sum = Enum.reduce(members, 0, fn(p, acc) -> Enum.at(p.grazings, group.round) + acc end)
			data = Enum.reduce(group.members, data, fn i, acc ->
				put_in(acc,
								[:participants, i, :profits],
								List.insert_at(data.participants[i].profits, -1,
									(Enum.at(data.participants[i].grazings, group.round) * (data.capacity - sum - data.cost))))
			end)

			data = put_in(data,
										[:groups, group_id, :group_profits],
										List.insert_at(group.group_profits, -1, (data.capacity - sum - data.cost) * sum))
							|> put_in([:groups, group_id, :confirming], true)
			data = Enum.reduce(group.members, data, fn i, acc ->
				put_in(acc,[:participants, i, :answers],0)
			end)
			results = Enum.reduce(group.members, data.results.participants, fn i, acc -> Map.put(acc, i, data.participants[i].grazings) end)
			data = data |> put_in([:results, :participants], results)

			if group.round >= data.max_round - 1 do
				data =	Enum.reduce(group.members, data, fn id, acc ->
									Map.put(acc,:profits_data, [data.participants[id].profits] ++ acc.profits_data)
								end)
			end
		end
		data
	end

	def update_confirm(data, id) do
		group_id = data.participants[id].group
		group = data.groups[group_id]

		data = put_in(data, [:participants, id, :confirmed], true)
		confirms = data.participants[id].confirms + 1
		data = Enum.reduce(group.members, data, fn i, acc ->
			put_in(acc,[:participants, i, :confirms],confirms)
		end)
		confirmed = Enum.all?(group.members, &(data.participants[&1].confirmed))
		if confirmed do
			# Game end?
			data = Enum.reduce(group.members, data, fn i, acc ->
				put_in(acc,[:participants, i, :confirms],0)
			end)
			if group.round >= data.max_round - 1 do
				results = Enum.reduce(group.members, data.results.participants, fn i, acc -> Map.put(acc, i, data.participants[i].grazings) end)
				data = data |> put_in([:groups, group_id, :confirming], false)
										|> put_in([:groups, group_id, :group_status], "result")
										|> put_in([:results, :participants], results)
										|> put_in([:results, :groups], data.groups)

				data =	Enum.reduce(group.members, data, fn id, acc ->
									put_in(acc, [:participants, id, :status], "result")
								end)

			else
				data = Enum.reduce(group.members, data, fn id, acc ->
									put_in(acc, [:participants, id, :answered], false)
									|> put_in([:participants, id, :confirmed], false)
								end)
							 |> update_in([:groups, group_id, :round], &(&1 + 1))
							 |> put_in([:groups, group_id, :confirming], false)
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
			results: "results",
			profits_data:  status == "result",
			_spread: [[:participants, id], [:groups, group_id]]
		}
	end

	def filter_data(data, id) do
		Transmap.transform(data, get_filter(data, id), diff: false)
		|> Map.delete(:participants)
	end
end

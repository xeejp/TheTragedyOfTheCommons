defmodule TheTragedyOfTheCommons.Participant do
  def finish_description(data, id) do
    update_in(data, [:participants, id, :is_finish_description], fn _ -> true end)
  end

  def update_snum(data, id, snum) do
    update_in(data, [:participants, id, :id], fn _ -> snum end)
  end

  def update_grazing(data, id, num) do
    update_in(data, [:participants, id, :grazingNum], fn _ -> num end)
  end

  def get_filter(data, id) do
    %{
      _default: true,
      participants: %{
        id => true
      },
      participants_number: "participantsNumber",
      groups_number: false,
      group_size: "groupSize",
      groups: %{
        data.participants[id].group => "group"
      },
      _spread: [[:participants, id]]
    }
  end

  def filter_data(data, id) do
    Transmap.transform(data, get_filter(data, id), diff: false)
    |> Map.delete(:participants)
  end

  def filter_diff(data, diff, id) do
    Transmap.transform(diff, get_filter(data, id), diff: true)
    |> Map.delete(:participants)
  end
end


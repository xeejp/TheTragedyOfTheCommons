defmodule TheTragedyOfTheCommons.Participant do

  def finish_description(data, id) do
    update_in(data, [:participants, id, :is_finish_description], fn _ -> true end)
  end

  def filter_data(data, id, diff: diff) do
    map = %{
      _default: true,
      participants: %{
        id => true
      },
      participants_number: "participantsNumber",
      _spread: [[:participants, id]]
    }
    data
    |> Transmap.transform(map, diff: diff)
    |> Map.delete(:participants)
  end
end


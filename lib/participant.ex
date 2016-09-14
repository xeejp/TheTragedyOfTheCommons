defmodule TheTragedyOfTheCommons.Participant do
  def filter_data(data, id, diff: diff) do
    map = %{
      page: true,
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


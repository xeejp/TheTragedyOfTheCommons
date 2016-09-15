defmodule TheTragedyOfTheCommons.Host do

  def change_page(data, page) do
    Map.update!(data, :page, fn _ -> page end)
  end

  def filter_data(data, diff: diff) do
    map = %{
      _default: true,
      participants_number: "participantsNumber",
      groups_number: "groupsNumber",
    }
    Transmap.transform(data, map, diff: diff)
  end
end

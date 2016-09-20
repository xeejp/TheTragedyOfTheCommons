defmodule TheTragedyOfTheCommons.Host do
  def change_page(data, page) do
    Map.update!(data, :page, fn _ -> page end)
  end

  def get_filter(data) do
    map = %{
      _default: true,
      participants_number: "participantsNumber"
    }
  end

  def filter_data(data) do
    Transmap.transform(data, get_filter(data), diff: false)
  end
end

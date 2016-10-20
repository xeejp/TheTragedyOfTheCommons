defmodule TragedyOfTheCommons do
  use XeeThemeScript
  require Logger
  alias TragedyOfTheCommons.Main
  alias TragedyOfTheCommons.Actions
  alias TragedyOfTheCommons.Host
  alias TragedyOfTheCommons.Participant

  # Callbacks
  def script_type do
    :message
  end

  def install, do: nil

  def init do
    {:ok, %{data: Main.init()}}
  end

  def join(data, id) do
    wrap_result(data, Main.join(data, id))
  end

  # Host router
  def handle_received(data, %{"action" => action, "params" => params}) do
    Logger.debug("[TragedyOfTheCommons] #{action} #{inspect params}")
    result = case {action, params} do
      {"fetch contents", _} -> Actions.update_host_contents(data)
      {"change page", page} -> Host.change_page(data, page)
      {"update config", config} -> Host.update_config(data, config)
      {"update description", description} -> Host.update_description(data, description)
      {"match", _} -> Host.match(data)
      _ -> {:ok, %{data: data}}
    end
    wrap_result(data, result)
  end

  # Participant router
  def handle_received(data, %{"action" => action, "params" => params}, id) do
    Logger.debug("[TragedyOfTheCommons] #{action} #{inspect params}")
    result = case {action, params} do
      {"fetch contents", _} -> Actions.update_participant_contents(data, id)
      {"finish description", _} -> Participant.finish_description(data, id)
      {"update snum", snum} -> Participant.update_snum(data, id, snum)
      {"update grazing", num} -> Participant.update_grazing(data, id, num)
      _ -> {:ok, %{data: data}}
    end
    wrap_result(data, result)
  end

  # Utilities
  def wrap_result(old, {:ok, result}) do
    {:ok, Main.compute_diff(old, result)}
  end

  def wrap_result(old, new) do
    {:ok, Main.compute_diff(old, %{data: new})}
  end
end

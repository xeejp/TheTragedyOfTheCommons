defmodule TragedyOfTheCommons.Mixfile do
  use Mix.Project

  def project do
    [app: :xee_tragedy_of_the_commons,
     version: "0.1.0",
     build_path: "../../_build",
     config_path: "../../config/config.exs",
     deps_path: "../../deps",
     lockfile: "../../mix.lock",
     elixir: "~> 1.3",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps]
  end

  def application do
    [applications: [:logger]]
  end

  defp deps do
    [{:xeethemescript, "~> 0.1.0"},
     {:json_diff_ex, github: "ryo33/json_diff_ex", branch: "fix-array-diff"},
     {:transmap, "~> 0.2.0"}]
  end
end

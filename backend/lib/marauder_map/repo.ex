defmodule MarauderMap.Repo do
  use Ecto.Repo,
    otp_app: :marauder_map,
    adapter: Ecto.Adapters.Postgres
end

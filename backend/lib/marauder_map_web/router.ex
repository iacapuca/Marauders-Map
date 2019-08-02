defmodule MarauderMapWeb.Router do
  use MarauderMapWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", MarauderMapWeb do
    pipe_through :api
  end
end

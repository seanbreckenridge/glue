defmodule GlueWeb.PageController.Utils do
  @moduledoc """
  Helper functions for the PageController
  """
  alias GlueWeb.Constants, as: Const

  # returns a map of common attributes to pass to html templates
  # set site_name to nil to only display the page title
  # and not "Site Name - Page Title"
  def common_values(page_title \\ nil, site_name \\ Const.site_name()) do
    %{page_title: page_title, site_name: site_name}
  end

  # Renders the page name and site title to a string
  def add_page_title(data) do
    page_title =
      cond do
        data.site_name && data.page_title ->
          "#{data.site_name} - #{data.page_title}"

        data.page_title ->
          data.page_title

        true ->
          data.site_name
      end

    Map.drop(data, [:site_name, :page_title]) |> Map.put(:title, page_title)
  end
end

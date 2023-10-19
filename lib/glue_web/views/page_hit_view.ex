defmodule GlueWeb.PageHitView do
  use GlueWeb, :view

  def render("count.json", %{page_hits: page_hit_count, epochs: data}) do
    %{count: page_hit_count, epochs: data}
  end

  def render("count.json", %{page_hits: page_hit_count}) when is_number(page_hit_count) do
    %{count: page_hit_count}
  end
end

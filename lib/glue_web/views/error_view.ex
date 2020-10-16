defmodule GlueWeb.ErrorView do
  use GlueWeb, :view

  # if the template/errors/{status_code}.html.eex file exists,
  # phoenix automatically renders it when that error occurs
  # see https://hexdocs.pm/phoenix/custom_error_pages.html

  # By default, Phoenix returns the status message from
  # the template name. For example, "404.html" becomes
  # "Not Found".
  def template_not_found(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end
end

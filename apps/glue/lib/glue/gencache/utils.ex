defmodule Glue.GenCache.Utils do
  require Logger

  @doc """
  Checks if an external cache has expired.
  meta_kwlist is defined in config/config.exs
  for each endpoint, specifies the time
  in milliseconds before an item is stale

  was_updated_at is the updated_at
  field from Ecto for each item in the db.

  returns nil if it hasnt expired
  """
  def check_expiry(meta_kwlist, was_updated_at) do
    # if the elapsed time is less than
    if NaiveDateTime.diff(
         NaiveDateTime.utc_now(),
         was_updated_at,
         :millisecond
       ) - meta_kwlist[:refresh_ms] < 0 do
      nil
    else
      meta_kwlist
    end
  end

  @doc """
  Indexes into the meta Keyword list
  to get the full Keyword list based on the db_id
  """
  def get_kwlist(meta_kwlist, id) do
    meta_kwlist |> Enum.at(id - 1)
  end

  def describe(meta_kwlist, id) do
    get_kwlist(meta_kwlist, id) |> Keyword.get(:service_key)
  end

  @doc """
  Uses the service key to dynamically generate the module name
  for an external cache service
  """
  def load_external_api_module(meta_kwlist, id) do
    short_module_name =
      get_kwlist(meta_kwlist, id)
      |> Keyword.get(:service_key)
      |> String.capitalize()

    module_name = "Elixir.Glue.GenCache.External.#{short_module_name}"

    module =
      try do
        String.to_existing_atom(module_name)
      rescue
        ArgumentError ->
          String.to_atom(module_name)
      end

    {:module, module} = Code.ensure_loaded(module)
    module
  end

  @doc """
  Wrapper/handler for making an HTTP request. Returns {:ok, response_body} if
  succeeded, else {:error, response_body/reason}
  """
  def generic_http_request(url, headers \\ [], options \\ []) do
    case HTTPoison.get(url, headers, options) do
      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        cond do
          status_code >= 200 and status_code < 400 ->
            Logger.debug("Request to #{url} succeeded")
            {:ok, body}

          true ->
            IO.inspect(body)
            Logger.warn("#{url} request failed with status_code #{status_code}")
            {:error, body}
        end

      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.warn("#{url} request failed with error:")
        IO.inspect({:error, reason})
        {:error, %{}}
    end
  end

  @doc """
  make a generic request to a URL with headers/options
  and parse the JSON response to a map
  """
  def generic_json_request(url, headers \\ [], options \\ []) do
    case HTTPoison.get(url, headers, options) do
      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        response =
          case Jason.decode(body) do
            {:ok, json_map} -> json_map
            {:error, _} -> %{"error" => "Error decoding response to JSON: #{body}"}
          end

        cond do
          is_map(response) and Map.has_key?(response, "error") ->
            Logger.warn("#{url} request failed with status_code #{status_code}")
            IO.inspect(response)

          status_code >= 200 and status_code < 400 ->
            Logger.debug("Request to #{url} succeeded")
            {:ok, response}

          true ->
            Logger.warn("#{url} request failed with status_code #{status_code}")
            IO.inspect(response)
            {:error, response}
        end

      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.warn("#{url} request failed with error:")
        IO.inspect({:error, reason})
        {:error, %{}}
    end
  end
end

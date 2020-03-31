defmodule TeamMissionWeb.PageView do
    use TeamMissionWeb, :view
  
    def render("index.html", _assigns) do
        {:safe, File.read!("assets/build/index.html")}
    end
end
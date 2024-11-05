import { useState, useEffect } from "react";
import { RouteMap } from "./RouteMap";

const BACKEND_SERVER = "http://localhost:3000";

function App() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetch(BACKEND_SERVER + "/maps/123")
      .then((response) => response.json())
      .then((res) => setMap(res));
  }, []);

  return <>{map ? <RouteMap data={map} /> : "Loading .. "}</>;
}

export default App;

import { useState, useEffect } from "react";
import { RouteMap } from "./RouteMap";

const BACKEND_SERVER = "http://localhost:3000";

function App() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetch(BACKEND_SERVER + "/maps/G12/ELY")
      .then((response) => response.json())
      .then((res) => setMap(res));
  }, []);

  return (
    <>
      {map
        ? map.map((item) => (
            <>
              <h2>{item.title}</h2>
              <RouteMap data={item.map} />
            </>
          ))
        : "Loading .. "}
    </>
  );
}

export default App;

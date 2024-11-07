import { useState, useEffect } from "react";
import { RouteMap } from "./RouteMap";

const BACKEND_SERVER = "http://localhost:3000";

function App() {
  const [map, setMap] = useState(null);

  const [from, setFrom] = useState("CBG");
  const [to, setTo] = useState("G01");

  function getRoute(from, to) {
    setMap(null);
    fetch(BACKEND_SERVER + `/maps/${from}/${to}`)
      .then((response) => response.json())
      .then((res) => setMap(res));
  }

  useEffect(() => {
    getRoute(from, to);
  }, []);

  let count = 1;

  return (
    <div>
      <div>
        <label htmlFor="">From</label>
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          type="text"
        />
      </div>
      <div>
        <label htmlFor="">To</label>
        <input value={to} onChange={(e) => setTo(e.target.value)} type="text" />
      </div>
      <div>
        <button onClick={() => getRoute(from, to)}>Find</button>
      </div>

      <h1>
        {from} to {to}
      </h1>

      {map
        ? map.map((item) => (
            <>
              <h2>{"Map " + count++ + ": " + item.title}</h2>
              <RouteMap data={item.map} />
            </>
          ))
        : "Loading .. "}
    </div>
  );
}

export default App;

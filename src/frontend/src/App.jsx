import { useState, useEffect } from "react";
import { RouteMap } from "./components/RouteMap";
import { StationPicker } from "./components/StationPicker";

const BACKEND_SERVER = "http://localhost:3000";

function App() {
  const [stationList, setStationList] = useState(null);

  const [map, setMap] = useState(null);

  const [from, setFrom] = useState("Cambridge");
  const [to, setTo] = useState("Norwich");

  // function getRoute(from, to) {
  //   setMap(null);
  //   fetch(BACKEND_SERVER + `/maps/${from}/${to}`)
  //     .then((response) => response.json())
  //     .then((res) => setMap(res));
  // }
  function getStations() {
    setMap(null);
    fetch(BACKEND_SERVER + `/stations`)
      .then((response) => response.json())
      .then((res) => setStationList(res));
  }

  useEffect(() => {
    getStations();
  }, []);

  let count = 1;

  return (
    <div>
      <StationPicker
        key="fromStation"
        stations={stationList}
        value={from}
        onSelected={(st) => setTo(st)}
      >
        From:
      </StationPicker>
      <StationPicker
        value={to}
        onSelected={(st) => setFrom(st)}
        key="toStation"
        stations={stationList}
      >
        To:
      </StationPicker>

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

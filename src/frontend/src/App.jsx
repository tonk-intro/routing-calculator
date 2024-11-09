import { useState, useEffect } from "react";
import { RouteMap } from "./components/RouteMap";
import { StationPicker } from "./components/StationPicker";

const BACKEND_SERVER = "http://localhost:3000";

function App() {
  const [stationList, setStationList] = useState(null);

  const [maps, setMaps] = useState(null);

  const [from, setFrom] = useState("Cambridge");
  const [to, setTo] = useState("Norwich");

  function getRoute(from, to) {
    setMaps(null);
    fetch(BACKEND_SERVER + `/maps/${from}/${to}`)
      .then((response) => response.json())
      .then((res) => {
        console.table(res);
        if (res.maps != null) {
          // console.log("Setting the map");
          setMaps(res.maps);
        }
      });
  }
  function getStations() {
    fetch(BACKEND_SERVER + `/stations`)
      .then((response) => response.json())
      .then((res) => setStationList(res));
  }

  useEffect(() => {
    getStations();
  }, []);

  useEffect(() => {
    if (!stationList) return;
    if (
      stationList.some((st) => st.name == from) &&
      stationList.some((st) => st.name == to)
    ) {
      console.log(`Let's fetch fetch route from ${from} to ${to}`);
      getRoute(from, to);
    }
  }, [from, to, stationList]);

  let count = 1;

  console.log(maps);

  return (
    <div>
      <StationPicker
        stations={stationList}
        value={from}
        onSelected={(st) => setFrom(st)}
      >
        From:
      </StationPicker>
      <StationPicker
        value={to}
        onSelected={(st) => setTo(st)}
        stations={stationList}
      >
        To:
      </StationPicker>

      <h1>
        {from} to {to}
      </h1>

      {maps
        ? maps.map((item) => (
            <>
              <h2>
                {"Map " +
                  count++ +
                  ": " +
                  item.route +
                  " with Map(s) " +
                  item.map.title}
              </h2>
              <RouteMap data={item.map.map} />
            </>
          ))
        : "Loading .. "}
    </div>
  );
}

export default App;

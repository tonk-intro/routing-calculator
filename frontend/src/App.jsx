import { useState, useEffect } from "react";
import { StationPicker } from "./components/StationPicker";
import "./style.css";
import RouteOverview from "./components/RouteOverview";
import ErrorView from "./components/ErrorView";

const BACKEND_SERVER = "http://localhost:3000";

function App() {
  const [stationList, setStationList] = useState(null);

  const [route, setRoute] = useState(null);

  const [from, setFrom] = useState("Cambridge");
  const [to, setTo] = useState("Norwich");

  function getRoute(from, to) {
    setRoute(null);
    fetch(BACKEND_SERVER + `/maps/${from}/${to}`)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        console.log("SETTING ROUTE");
        console.log(res);
        setRoute(res);
      })
      .catch((err) => {
        setRoute({
          error: true,
          errorMsg: `Failed to fetch route: ${err.message}.`,
        });
      });
  }
  function getStations() {
    fetch(BACKEND_SERVER + `/stations`)
      .then((response) => response.json())
      .then((res) => {
        setStationList(res);
      })
      .catch((err) => {
        setRoute({
          error: true,
          errorMsg: `Failed to fetch stations: ${err.message}.`,
        });
      });
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
      // console.log(`Let's fetch fetch route from ${from} to ${to}`);
      getRoute(from, to);
    }
  }, [from, to, stationList]);

  return (
    <>
      <div>
        <h1>Permitted Route Calculator</h1>
        <div className="picker-container">
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
        </div>
        <div></div>
      </div>

      <ErrorView data={route} />
      <RouteOverview stationList={stationList} route={route} />
    </>
  );
}

export default App;

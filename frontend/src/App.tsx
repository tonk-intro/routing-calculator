import { useState, useEffect } from "react";
import { StationPicker } from "./components/StationPicker";
import "./style.css";
import RouteOverview from "./components/RouteOverview";
import ErrorView from "./components/ErrorView";
import type { ErrorInfo } from "./components/ErrorView";

import { Station, PermittedRouteOverview } from "@backend/shared"

const BACKEND_SERVER = import.meta.env.VITE_BACKEND;


function App() {
  const [stationList, setStationList] = useState<Station[] | null>(null);

  const [route, setRoute] = useState<PermittedRouteOverview | ErrorInfo | null>(null);

  const [from, setFrom] = useState("Cambridge");
  const [to, setTo] = useState("Norwich");

  function getRoute(from: string, to: string) {
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
            onSelected={(st: string) => setFrom(st)}
          >
            From:
          </StationPicker>
          <StationPicker
            value={to}
            onSelected={(st: string) => setTo(st)}
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

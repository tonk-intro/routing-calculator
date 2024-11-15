import { useRef } from "react";

let counter = 0;

export function StationPicker({ key, stations, children, onSelected, value }) {
  const id = useRef(counter++);

  if (!stations) {
    return <p>Loading ...</p>;
  }

  function onChange(e) {
    // if (stations.some((st) => st.name == e.target.value)) {
    onSelected(e.target.value);
    // }
  }

  return (
    <div className="station-picker">
      <label htmlFor={key + "station"}>{children}</label>
      <input
        list={id.current + "station-list"}
        id={id.current + "station"}
        name={id.current + "station-choice"}
        value={value}
        onChange={(e) => onChange(e)}
      />
      <datalist id={id.current + "station-list"}>
        {stations.map((st) => (
          <option key={st.id} value={st.name} />
        ))}
      </datalist>
    </div>
  );
}

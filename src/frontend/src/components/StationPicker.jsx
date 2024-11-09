import { useRef } from "react";

let counter = 0;

export function StationPicker({
  key,
  caption,
  stations,
  children,
  onSelected,
  value,
}) {
  if (!stations) {
    return <p>Loading ...</p>;
  }

  const id = useRef(counter++);

  function onChange(e) {
    // if (stations.some((st) => st.name == e.target.value)) {
    onSelected(e.target.value);
    // }
  }

  return (
    <>
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
    </>
  );
}

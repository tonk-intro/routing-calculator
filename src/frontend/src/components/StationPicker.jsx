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

  function onChange(e) {
    if (stations.some((st) => st.name == e.target.value)) {
      onSelected(e.target.value);
    }
  }

  return (
    <>
      <label htmlFor={key + "station"}>{children}</label>
      <input
        list={key + "station-list"}
        id={key + "station"}
        name={key + "station-choice"}
        value={value}
        onChange={(e) => onChange(e)}
      />
      <datalist id={key + "station-list"}>
        {stations.map((st) => (
          <option key={st.id} value={st.name} />
        ))}
      </datalist>
    </>
  );
}

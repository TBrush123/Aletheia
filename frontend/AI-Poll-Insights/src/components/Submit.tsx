function Submit(props: { text?: string }) {
  return (
    <button className="w-full bg-yellow-400 py-2 rounded font-bold">
      {props.text || "Submit"}
    </button>
  );
}

export default Submit;

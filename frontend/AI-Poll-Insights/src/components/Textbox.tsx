function Textbox(props: { placeholder: string; type?: string }) {
  return (
    <input
      type={props.type || "text"}
      placeholder={props.placeholder}
      className="w-full p-2 mb-4 border rounded"
    />
  );
}

export default Textbox;

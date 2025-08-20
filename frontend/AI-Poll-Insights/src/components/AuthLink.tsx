import { Link } from "react-router-dom";

function AuthLink(props: { text: string }) {
  return (
    <a className="text-yellow-600">
      {props.text}
    </a>
  );
}

export default AuthLink;

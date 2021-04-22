import "./style.css";

export default function (props: any) {
  return (
    <ul>
      <li className="me">{props.message}</li>
    </ul>
  );
}

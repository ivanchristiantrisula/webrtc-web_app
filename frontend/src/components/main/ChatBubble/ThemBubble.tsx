import "./style.css";

export default function (props: any) {
  return (
    <ul>
      <li className="them">{props.message}</li>
    </ul>
  );
}

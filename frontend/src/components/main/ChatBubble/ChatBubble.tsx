import "./style.css";

export default function (props: any) {
  const renderBubbleData = () => {
    if (props.data.type == "text") {
      return props.data.message;
    } else {
      let typeSplit = props.data.type.split("/");
      console.log(props.data);
      if (typeSplit[0] == "image") {
        return (
          <img
            src={
              "data:image/jpeg;base64," +
              props.data.fileBuffer.toString("base64")
            }
          ></img>
        );
      }
    }
  };

  return (
    <ul>
      <li className={props.data.from == props.socketID ? "me" : "them"}>
        {renderBubbleData()}
      </li>
    </ul>
  );
}

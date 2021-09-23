import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const Whiteboard = (props: { handleCaptureStream: Function }) => {
  const canvas = useRef<HTMLCanvasElement>();
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    //@ts-ignore
    props.handleCaptureStream(canvas.current.captureStream(30));
  }, []);
  const startDrawing = (event: MouseEvent) => {
    setDrawing(true);
    onDrawing(event);
  };

  const endDrawing = () => {
    setDrawing(false);
    canvas.current.getContext("2d").beginPath();
  };

  const onDrawing = (event: MouseEvent) => {
    if (!drawing) return;

    const ctx = canvas.current.getContext("2d");

    ctx.lineWidth = 10;
    ctx.lineCap = "round";

    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
  };

  return (
    <canvas
      style={{ backgroundColor: "white" }}
      height={window.innerHeight}
      width={window.innerHeight}
      ref={canvas}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={onDrawing}
    >
      Canvas
    </canvas>
  );
};

export default Whiteboard;

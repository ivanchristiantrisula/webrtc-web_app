import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const initState = {
  color: "#000000",
  lineCap: "round",
  lineWidth: 10,
};

const Whiteboard = (props: { handleCaptureStream: Function }) => {
  const canvas = useRef<HTMLCanvasElement>();
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);

  const [color, setColor] = useState(initState.color);
  const [lineCap, setLineCap] = useState<any>(initState.lineCap);
  const [lineWidth, setLineWidth] = useState(initState.lineWidth);

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    //@ts-ignore
    props.handleCaptureStream(canvas.current.captureStream(30));

    setBackgroundColor();
  }, []);

  const setBackgroundColor = () => {
    const context = canvas.current.getContext("2d");

    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.current.width, canvas.current.height);

    context.globalCompositeOperation = "source-over";
  };

  const startDrawing = (event: MouseEvent) => {
    setDrawing(true);
    onDrawing(event);
    //@ts-ignore
  };

  const endDrawing = () => {
    setDrawing(false);
    canvas.current.getContext("2d").beginPath();
  };

  const onDrawing = (event: MouseEvent) => {
    if (!drawing) return;

    const ctx = canvas.current.getContext("2d");

    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;

    ctx.lineTo(event.clientX, event.clientY);
    ctx.strokeStyle = color;
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

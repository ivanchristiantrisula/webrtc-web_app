import { useEffect, useRef, useState } from "react";

export default (props: any) => {
  const [userStream, setUserStream] = useState<any>();
  const [partnerStream, setPartnerStream] = useState<any>();
  let userVideo = useRef<any>();
  let partnerVideo = useRef<any>();

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      alert("stream");
      console.log(stream);
      setPartnerStream(stream);

      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: any) => {
        setUserStream(stream);
        props.peer.addStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });
  }, []);

  let UserVideo;
  if (userStream) {
    UserVideo = <video playsInline muted ref={partnerVideo} autoPlay />;
  }

  let PartnerVideo;
  if (partnerStream) {
    PartnerVideo = <video playsInline muted ref={partnerVideo} autoPlay />;
  }

  return (
    <div>
      {PartnerVideo}
      {UserVideo}
    </div>
  );
};

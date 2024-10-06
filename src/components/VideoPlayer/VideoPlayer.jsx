import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ user }) => {
  const ref = useRef();
  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);

  return (
    <div>
      UID: {user.uid}
      <div ref={ref} style={{ width: "400px", height: "400px" }}></div>
    </div>
  );
};

export default VideoPlayer;

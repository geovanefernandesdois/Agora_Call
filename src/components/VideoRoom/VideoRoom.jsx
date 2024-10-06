import AgoraRTC from "agora-rtc-sdk-ng";
import React, { useEffect, useState } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const APP_ID = "be5b47c8df4c4b7c8e07d771df2b2ab4";
const TOKEN =
  "007eJxTYIiT4z0Zua7Va9cR6yCj9OPBjjv1Fdoq+E9xHDh6We1ym6QCQ1KqaZKJebJFSppJskkSkJFqYJ5ibm6YkmaUZJSYZBJ2nSm9IZCR4Yf/bVZGBggE8dkZ3FPzyxLzUhkYAEqJH/M=";
const CHANNEL = "Geovane";
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };
  const handleUserLeft = (user) => {
    setUsers((previousUsers) => {
      return previousUsers.filter((u) => u.uid !== user.uid);
    });
  };

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);
    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          { uid, videoTrack, audioTrack },
        ]);
        client.publish(tracks);
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(tracks).then(() => client.leave());
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,400px)",
          gap: "40px",
        }}
      >
        {users.map((user) => {
          return <VideoPlayer key={user.uid} user={user} />;
        })}
      </div>
    </div>
  );
};

export default VideoRoom;

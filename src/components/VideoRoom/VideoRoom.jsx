import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import IconButton from "@mui/material/IconButton";
import AgoraRTC from "agora-rtc-sdk-ng";
import React, { useEffect, useState } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const APP_ID = "be5b47c8df4c4b7c8e07d771df2b2ab4";
const TOKEN =
  "007eJxTYPhktTte+d6DiU9aZHVXRhcxPZg4NfxvjF9dw+bDdz557hRUYEhKNU0yMU+2SEkzSTZJAjJSDcxTzM0NU9KMkowSk0zWp7OkNwQyMvB4NTEyMkAgiM/O4J6aX5aYl8rAAABB8SHN";
const CHANNEL = "Geovane";
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoRoom = ({ setJoined }) => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [micMuted, setMicMuted] = useState(false); // Estado do microfone

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }
    if (mediaType === "audio") {
      user.audioTrack.play(); // Tocar áudio do usuário remoto
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
      client.unpublish(localTracks).then(() => client.leave());
    };
  }, []);

  // Função para sair da sala e retornar à tela inicial
  const leaveRoom = () => {
    // Parar e fechar todas as tracks locais
    for (let localTrack of localTracks) {
      localTrack.stop();
      localTrack.close();
    }
    client.leave(); // Sair da sala do Agora
    setJoined(false); // Retornar à tela inicial
  };

  // Função para alternar o estado de mutar/desmutar microfone
  const toggleMic = () => {
    const audioTrack = localTracks[0]; // Assumindo que o áudio é a primeira track
    if (micMuted) {
      audioTrack.setEnabled(true); // Desmutar o microfone
    } else {
      audioTrack.setEnabled(false); // Mutar o microfone
    }
    setMicMuted(!micMuted); // Alternar o estado do botão
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "5rem",
          }}
        >
          {users.map((user) => {
            return <VideoPlayer key={user.uid} user={user} />;
          })}
        </div>
      </div>
      {/* Botão para mutar/desmutar microfone */}
      <IconButton onClick={toggleMic} style={{ marginTop: "5px" }}>
        {micMuted ? <MicOffIcon /> : <MicIcon />}
      </IconButton>
      {/* Botão para sair da sala */}
      <button onClick={leaveRoom} style={{}}>
        LEAVE ROOM
      </button>
    </>
  );
};

export default VideoRoom;

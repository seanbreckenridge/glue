import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const defaultSocketUrl = "wss://sean.fish/currently_listening/ws";

type Song = {
  title: string;
  artist: string;
  album?: string;
  started_at: number;
  base64_image: string;
};

type CurrentSong = {
  song?: Song;
  playing: boolean;
};

type Message = {
  msg_type: string;
  data: unknown;
};

const isCurrentSong = (cSong: unknown): cSong is CurrentSong => {
  if (typeof cSong !== "object" || cSong === null) {
    return false;
  }
  return "playing" in cSong;
};

const isMessage = (msg: unknown): msg is Message => {
  if (typeof msg !== "object" || msg === null) {
    return false;
  }
  return "msg_type" in msg && "data" in msg;
};

type CurrentPlayingOptions = {
  socketUrl?: string;
};

const useCurrentyListening = (options: CurrentPlayingOptions) => {
  const { sendMessage, lastMessage, lastJsonMessage, readyState } =
    useWebSocket(options.socketUrl ?? defaultSocketUrl);
  const [currentSong, setCurrentSong] = useState<CurrentSong>({
    playing: false,
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      console.log("lastJsonMessage", lastJsonMessage);
      if (isMessage(lastJsonMessage)) {
        const resp: Message = lastJsonMessage;
        switch (resp.msg_type) {
          case "currently-listening":
            if (isCurrentSong(resp.data)) {
              console.log("updating currently-listening", resp.data);
              setCurrentSong(resp.data);
            } else {
              console.log("invalid currently-listening", resp.data);
            }
            break;
          case "pong":
            console.log("pong");
            break;
          default:
            console.log("unknown msg_type:", resp.msg_type);
            break;
        }
      } else {
        console.log("couldnt parse message:", lastMessage);
      }
    }
  }, [lastJsonMessage, lastMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage("currently-listening");
    }
  }, [readyState]);

  return {
    song: currentSong.song ?? undefined,
    listening: currentSong?.playing ?? false,
  };
};

type CurrentlyListeningNotificationProps = {
  song?: Song;
  listening: boolean;
  style?: React.CSSProperties;
};

export const CurrentlyListeningNotification = ({
  song,
  listening,
  style,
}: CurrentlyListeningNotificationProps) => {
  // if theres a song playing, show it in the bottom left floating box
  // floating box
  const display = listening && song ? "block" : "none";
  const bg = listening && song ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        padding: "1rem",
        backgroundColor: bg,
        color: "white",
        zIndex: 1000,
        maxWidth: "30rem",
        textOverflow: "ellipsis",
        overflow: "hidden",
        display,
        ...(style ?? {}),
      }}
    >
      {listening && song && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {(song.base64_image ?? "").length > 0 && (
            <img
              src={`data:image/jpeg;base64,${song.base64_image}`}
              style={{
                width: "4rem",
                height: "4rem",
                objectFit: "cover",
                marginRight: "0.5rem",
              }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                paddingBottom: "0.3rem",
              }}
            >
              Currently Listening ♫
            </div>
            <div>{song.title}</div>
            <div>{song.artist}</div>
            {song.album && <div>{song.album}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default useCurrentyListening;

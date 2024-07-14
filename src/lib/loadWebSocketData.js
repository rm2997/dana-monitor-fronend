
import useWebSocket, { ReadyState } from "react-use-websocket"
import React, {  useEffect } from 'react';
import { Chat } from "@mui/icons-material";

export const Home = () => {
  const WS_URL = "ws://192.168.56.107:25000"
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed")
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        data: {
          channel: "general-chatroom",
        },
      })
    }
  }, [readyState, sendJsonMessage])

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    console.log(`Got a new message: ${lastJsonMessage}`)
  }, [lastJsonMessage])

  return <Chat lastJsonMessage={lastJsonMessage} />
}
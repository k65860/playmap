import { useEffect, useState } from "react";
import { delay } from "../assets/functions";
import { useQueryClient } from "react-query";

export const _socket = new WebSocket(`ws://${location.hostname}:10000/ws`);

const useWebSocket = () => {
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState<WebSocket | undefined>(_socket);

  const connection = () => {
    setSocket(new WebSocket(`ws://${location.host}:10000/ws`));
  };

  const onClose = async () => {
    setSocket(undefined);
    await delay(1000);
    connection();
  };

  const onError = async () => {
    if (socket?.readyState === WebSocket.CONNECTING) {
      socket.close();
    }
    setSocket(undefined);
    await delay(1000);
    connection();
  };

  useEffect(() => {
    if (!socket) return;

    socket.onclose = onClose;
    socket.onerror = onError;

    socket.onmessage = (event) => {
      const url = event?.data?.replace?.(/^\/api/, ""); // "/text"
      queryClient.invalidateQueries(url);
    };

    return () => {
      socket.onclose = null;
      socket.onerror = null;
      socket.onmessage = null;
    };
  }, [socket]);

  return socket;
};

export default useWebSocket;

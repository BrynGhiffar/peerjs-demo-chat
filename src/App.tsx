import { useCallback, useState } from "react";
import { usePeer } from "./hooks/peer"

function App() {
  const { peerId, messages, setRoomId, broadcastMessage } = usePeer();
  const [tRoomId, setTRoomId] = useState("");
  const [message, setMessage] = useState("");
  const onClickJoinRoom = useCallback(() => {
    setRoomId(tRoomId);
  }, [tRoomId, setRoomId]);

  const onClickSendMessage = useCallback(() => {
    console.log("Sending message");
    broadcastMessage(message);
  }, [broadcastMessage, message]);
  return (
    <div className="p-3">
      Peer ID: {peerId}
      <div className="grid gap-1 w-1/2">
        <div className="grid grid-cols-[70px_1fr_100px] gap-2">
          <label>Room Id</label>
          <input type="text" className="rounded-md border border-gray-500" value={tRoomId} onChange={({ target }) => setTRoomId(target.value)} />
          <button className="bg-green-300 rounded-md text-sm p-1" onClick={onClickJoinRoom}>Join Room</button>
        </div>
        <div className="grid grid-cols-[70px_1fr_100px] gap-2">
          <label>Message</label>
          <input type="text" className="rounded-md border border-gray-500"  value={message} onChange={({ target }) => setMessage(target.value)}/>
          <button className="bg-green-300 rounded-md text-sm p-1" onClick={onClickSendMessage}>Send</button>
        </div>
      </div>
      <ul>
        {
          messages.map((m, idx) => (
            <li key={idx}>- {m}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default App

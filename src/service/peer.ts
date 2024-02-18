import { z } from "zod";

const peerServer = "http://localhost:5000";

export const joinRoom = async (peerId: string, roomId: string) => {
    const res = await fetch(`${peerServer}/join-room/${roomId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "peerId": peerId
        })
    });
    const resBody = await res.json();
    const parsedResBody = z.array(z.string()).parse(resBody);
    return parsedResBody;
};

export const roomMembers = async (roomId: string) => {
    const res = await fetch (`${peerServer}/members/${roomId}`)
    const resBody = await res.json();
    const parsedResBody = z.array(z.string()).parse(resBody);
    return parsedResBody;
}

export const leaveRoom = async (peerId: string, roomId: string) => {
    const res = await fetch(`${peerServer}/leave-room/${roomId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "peerId": peerId
        })
    });
    const resBody = await res.json();
    const parsedResBody = z.array(z.string()).parse(resBody);
    return parsedResBody;
};
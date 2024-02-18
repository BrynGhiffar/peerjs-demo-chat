import Peer from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { joinRoom, roomMembers } from "../service/peer";
import { z } from "zod";

const peer = new Peer({
        host: "localhost",
        port: 5000,
        path: "/peerjs/app",
        key: "ps",
        debug: 3,
        config: {
        }
    });

export const usePeer = () => {
    const peerRef = useRef(peer);
    const [ peerId, setPeerId ] = useState<string | null>(null);
    const [ roomId, setRoomId ] = useState<string | null>(null);
    const [ members, setMembers ] = useState<string[]>([]);
    const [ messages, setMessages ] = useState<string[]>([]);

    const broadcastMessage = useCallback(async (message: string) => {
        const wrapped = `${peerId}: ${message}`;
        for (const memPeerId of members) {
            if (memPeerId === peerId) continue;
            const conn = peerRef.current.connect(memPeerId);
            const opening = new Promise<null>((resolve, _) => conn.on("open", () => resolve(null)));
            await opening;
            try {
                await conn.send(wrapped);
                conn.close();
            } catch (err) {
                return;
            }
        }
        setMessages(prev => ([ ...prev, wrapped]));

    }, [peerId, members]);

    useEffect(() => {
        if (roomId === null) return;
        if (peerId === null) return;
        const run = async () => {
            await joinRoom(peerId, roomId);
        };
        run();
        const intervalId = setInterval(async () => {
            const members = await roomMembers(roomId);
            setMembers(members);
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }

    }, [roomId, peerId]);

    useEffect(() => {
        const peer = peerRef.current;
        peer.on("open", (id) => {
            setPeerId(id);
        });
        peer.on("connection", (conn) => {
            conn.on("data", (data) => {
                const parsed = z.string().safeParse(data);
                if (!parsed.success) return;
                setMessages(prev => ([ ...prev, parsed.data]));
            });
        });

        return () => {
            peer.removeAllListeners();
        }
    }, [setPeerId]);

    return { peerId, roomId, messages, setRoomId, broadcastMessage };
};
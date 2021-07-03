import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    isHighlighted: boolean;
    isAnswered: boolean;
    likesCount: number;
    hasLiked: boolean;
    likeId: string | undefined;

}

type FirebaseQuestions = Record<string, {
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {

            const databaseRoom = room.val();
            if (!databaseRoom) return;

            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parseQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likesCount: Object.values(value.likes ?? {}).length,
                    hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id),
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parseQuestions);
        });

        return () => {
            roomRef.off('value');
        }

    }, [roomId, user?.id])


    return {
        questions,
        title
    }
}
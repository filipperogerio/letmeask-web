import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import '../styles/room.scss';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}

type Question = {
    id: string;
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    isHighlighted: boolean;
    isAnswered: boolean;
}

type FirebaseQuestions = Record<string, {
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    isHighlighted: boolean;
    isAnswered: boolean;
}>

export function Room() {
    const { user } = useAuth();
    const param = useParams<RoomParams>();
    const roomId = param.id;
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');


    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {

            const databaseRoom = room.val();

            if (!databaseRoom) return;

            const firebaseQuestions: FirebaseQuestions = databaseRoom.question ?? {};
            const parseQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parseQuestions);


        })
    }, [roomId])

    async function handleNewQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === "") return;

        if (!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${roomId}/question`).push(question);

        setNewQuestion('');

    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleNewQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        value={newQuestion}
                        onChange={event => setNewQuestion(event.target.value)}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta,  <button>faça seu login</button>.</span>
                        )}
                        <Button type="submit">Enviar pergunta</Button>
                    </div>
                </form>
            </main>
            {JSON.stringify(questions)}
        </div >
    )
}
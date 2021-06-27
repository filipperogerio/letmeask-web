import { ReactNode, useState, createContext, useEffect } from "react";
import { auth, firebase } from '../services/firebase';

type User = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProvideProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProvideProps) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            getUser(user);
        });

        return () => {
            unsubscribe();
        }
    }, [])

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        getUser(result.user);

    }

    function getUser(user: firebase.User | null) {
        if (user) {

            const { displayName, photoURL, uid } = user;

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Gooogle Account.');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            });
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}
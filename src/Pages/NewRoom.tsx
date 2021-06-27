import { Link } from 'react-router-dom'
import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import '../styles/auth.scss'

export default function NewRoom() {
    return (
        <div id='page-auth'>
            <aside>
                <img
                    src={ilustrationImg}
                    alt='Ilustração simbolizando perguntas e respostas'
                />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire suas dúvidas de sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt='Letmeask' />
                    <h2>Criar uma nova sala</h2>
                    <form>
                        <input type='text' placeholder='Nome da sala' />
                        <Button type='submit'>Criar sala</Button>
                        <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                    </form>
                </div>
            </main>
        </div>
    )
}

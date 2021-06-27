import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Pages/Home';
import NewRoom from './Pages/NewRoom';
import './styles/global.scss';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
 
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route path='/' exact component={Home} />
        <Route path='/rooms/new' component={NewRoom} />
      </AuthContextProvider>
    </BrowserRouter>
  );

}

export default App;

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './styles/global.scss';
import { AuthContextProvider } from './contexts/AuthContext';
import { Home } from './Pages/Home';
import { NewRoom } from './Pages/NewRoom';
import { Room } from './Pages/Room';
import { AdminRoom } from './Pages/AdmiRoom';

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <AuthContextProvider>
          <Route path='/' exact component={Home} />
          <Route path='/rooms/new' component={NewRoom} />
          <Route path='/rooms/:id' component={Room} />
          <Route path='/admin/rooms/:id' component={AdminRoom} />
        </AuthContextProvider>
      </Switch>
    </BrowserRouter>
  );

}

export default App;

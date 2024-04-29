import { Container } from '@mui/material';
import './App.scss';
import Form from './components/Form/index';

function App() {
  return (
    <div className="App">
      <header>
        <img src='./beatxp-logo.svg' alt='logo' />
      </header>
      <Container>
        <Form />
      </Container>
    </div>
  );
}

export default App;

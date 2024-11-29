import './App.css';
import Router from './components/global/Router';

const apiKey = process.env.REACT_APP_API_KEY;

function App() {
  return (
      <>
        <Router></Router>
      </>
  );
}

export default App;

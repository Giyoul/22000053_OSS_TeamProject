import './App.css';
const apiKey = process.env.REACT_APP_API_KEY;
import Router from './components/global/Router';

function App() {
  return (
      <>
        <Router></Router>
      </>
  );
}

export default App;

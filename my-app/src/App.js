import logo from './logo.svg';
import './App.css';
import Register from './pages/Register';

function App() {
  return (
    <div className="App">
      <h1>SkilLoop</h1>
    </div>
  );
}

export default App;



<Route path="/register" element={<Register />} />
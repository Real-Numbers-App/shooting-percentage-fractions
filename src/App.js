import './App.css';
import { DragAndDrop } from './components/dragAndDrop'
// import { Clock } from './components/clock'

function App() {
  return (
    <div className="App">
      <p>Put the circles in their respective boxes.</p>
      <DragAndDrop />
    </div>
  );
}

export default App;

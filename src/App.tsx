import { ExerciseForm } from "./components/ExerciseForm";
import { exercises } from "./data/exercises";

function App() {
  return <ExerciseForm exercise={exercises[0]} />;
}

export default App;

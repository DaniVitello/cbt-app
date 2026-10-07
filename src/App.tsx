import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ExerciseList } from "./pages/ExerciseList";
import { ExercisePage } from "./pages/ExercisePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ExerciseList />} />
          <Route path="/exercises/:exerciseId" element={<ExercisePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

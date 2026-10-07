import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ExerciseList } from "./pages/ExerciseList";
import { ExercisePage } from "./pages/ExercisePage";
import { HistoryPage } from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ExerciseList />} />
          <Route path="/exercises/:exerciseId" element={<ExercisePage />} />
          <Route path="/history/:exerciseId" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

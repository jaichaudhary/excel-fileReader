import "./App.css";
import FileUploader from "./Components/FileUploader";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <FileUploader />
      </div>
    </DndProvider>
  );
}

export default App;

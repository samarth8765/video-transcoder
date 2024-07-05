import "./App.css";
import { FileUpload } from "./components/FileUpload";

function App() {
  return (
    <div>
      <div>
        <h1 className="text-center text-5xl mt-3">File Upload</h1>
      </div>
      <FileUpload />
    </div>
  );
}

export default App;

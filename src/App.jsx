import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadVideo from "./Components/UploadVideo";
import UploadAvatar from "./Components/UploadAvatar";
// import UploadAvatar from "./Components/UploadAvatar"; // Assuming this component exists

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadVideo />} />
        <Route path="/uploadAvatar" element={<UploadAvatar />} />
        {/* <Route path="/" element={<UploadAvatar />} /> */}
      </Routes>
    </BrowserRouter>
  );
}


import './App.css';

import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/home";
import EditorPage  from './pages/editorpage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
         <>
         <Toaster position='top-center'></Toaster>
           <BrowserRouter>
                  <Routes>
                       <Route path="/" element={<Home/>}></Route>
                       <Route path="/editor/:roomID" element={<EditorPage/>}></Route>
                  </Routes>
           </BrowserRouter>
         </>
           
        
    </div>
  );
}

export default App;

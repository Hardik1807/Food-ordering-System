import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Admin from "./screens/Admin"
import { Toaster } from 'react-hot-toast';
import Home from './screens/Home';
import AddDish from './screens/AddDish';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Login from './screens/Login';

import { CartProvider } from './components/ContextReducer';
// import MyOrder from './screens/MyOrder';


function App() {
  return (
    <CartProvider>
      <Router>
      <Toaster />
        <div>
          <Routes>
          <Route path="/admin_panel" element={<Admin />} />
            <Route path="/home/:table" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route exact path="/admin_panel/addDishes" element={<AddDish />} />
            {/* <Route exact path="/myorder" element={<MyOrder />} /> */}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

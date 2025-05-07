import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Form from './components/Form';
import View from './components/View';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
     <div className='nav'>
     <Link className="navbar-brand d-flex align-items-center" to="/">
  <strong className="ms-2">
  <img src="https://cdn-icons-png.flaticon.com/512/3565/3565418.png" alt="Logo" />
    RecipeBook</strong>
</Link>

        
        {/* This button will toggle the right-side drawer */}
        <button className="navbar-toggler" type="button" onClick={toggleDrawer}>
        <button className="menu-icon"><i class="fa-solid fa-bars"></i></button>
        </button>

        {/* Optional normal navbar links for large screens */}
        <div className="collapse navbar-collapse d-none d-lg-flex">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">👁️‍🗨️ View Recipes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add">✚ Add Recipe</Link>
            </li>
          </ul>
        </div>
     </div>
      </nav>

      {/* Right-side slide-in drawer */}
      <div className={`custom-drawer ${showDrawer ? 'show' : ''}`}>
        <div className="drawer-header">
          <h5>Menu</h5>
          <button className="btn-close" onClick={toggleDrawer}></button>
        </div>
        <img alt='banner' src={`${process.env.PUBLIC_URL}/banner.jpg`} />
        <ul className="drawer-links">
        <li><Link to="/" onClick={toggleDrawer}>👁️‍🗨️ View Recipes</Link></li>
          <li><Link to="/add" onClick={toggleDrawer}>✚ Add Recipe</Link></li>
        </ul>
      </div>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<View />} />
          <Route path="/add" element={<Form />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

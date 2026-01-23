import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
// import Form from "./components/Form/Form";
// import View from "./components/View/View";
import Search from "./components/Search/Search";
import Footer from "./components/Footer/Footer";
import AuthModal from "./components/Auth/AuthModal";
import Watchlist from "./components/Watchlist/Watchlist";
import Recommendation from "./components/Recommendation/Recommendation";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./components/firebase"; // ✅ correct path

function App() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null); // ✅ user state

  const toggleDrawer = () => setShowDrawer(!showDrawer);

  // ✅ Listen to auth state ONCE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Logged User:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <div className="nav w-100 d-flex align-items-center">

          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3565/3565418.png"
              alt="Logo"
              width="40"
            />
            <strong className="ms-2">RecipeBook</strong>
          </Link>

          {/* Mobile menu button */}
          <button className="navbar-toggler" onClick={toggleDrawer}>
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Menu */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav ms-auto align-items-center">
              {/* <li className="nav-item">
                <Link className="nav-link" to="/">👁️‍🗨️ View Recipes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add">✚ Add Recipe</Link>
              </li> */}
              <li className="nav-item">
  <Link className="nav-link" to="/">
    <i className="fa-solid fa-lightbulb"></i> Recommendation
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/Search">
    <i className="fa-solid fa-magnifying-glass"></i> Search
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/Watchlist">
    <i className="fa-solid fa-star"></i> Watchlist
  </Link>
</li>

              {/* ✅ Login / Logout Button */}
             <li className="nav-item ms-3">
  {user ? (
    <button className="logout" onClick={handleLogout}>
      <i className="fa-solid fa-right-from-bracket"></i> Logout
    </button>
  ) : (
    <button className="login" onClick={() => setShowAuth(true)}>
      <i className="fa-solid fa-right-to-bracket"></i> Login
    </button>
  )}
</li>

            </ul>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      <div className={`custom-drawer ${showDrawer ? "show" : ""}`}>
        <div className="drawer-header">
          <h5>Menu</h5>
          <button className="btn-close" onClick={toggleDrawer}></button>
        </div>

        <ul className="drawer-links">
          {/* <li><Link to="/" onClick={toggleDrawer}>View Recipes</Link></li>
          <li><Link to="/add" onClick={toggleDrawer}>Add Recipe</Link></li> */}
          <li><Link to="/" onClick={toggleDrawer}><i className="fa-solid fa-lightbulb"></i> Recommendation</Link></li>
          <li><Link to="/Search" onClick={toggleDrawer}><i className="fa-solid fa-magnifying-glass"></i> Search</Link></li>
          <li><Link to="/Watchlist" onClick={toggleDrawer}><i className="fa-solid fa-star"></i> Watchlist</Link></li>

          <li>
            {user ? (
              <button className="btn btn-danger w-100" onClick={handleLogout}>
               <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            ) : (
              <button className="btn btn-warning w-100" onClick={() => {
                setShowAuth(true);
                toggleDrawer();
              }}>
               <i className="fa-solid fa-right-to-bracket"></i> Login
              </button>
            )}
          </li>
        </ul>
      </div>

      <div className="container mt-4">
        <Routes>
          {/* <Route path="/" element={<View />} />
          <Route path="/add" element={<Form />} /> */}
          <Route path="/" element={<Recommendation />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Watchlist" element={<Watchlist />} />
        </Routes>
      </div>

      <Footer />

      {/* Auth Popup */}
      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
      
    </>
  );
}

export default App;

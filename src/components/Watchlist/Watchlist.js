// src/components/Watchlist/Watchlist.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PopUp from "../PopUp/PopUp";
import "./Watchlist.css";

const Watchlist = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // ✅ Popup state
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch watchlist for logged-in user
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "Recipe", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setWatchlist(docSnap.data().watchlist || []);
        }
      } catch (error) {
        console.error("Failed to fetch watchlist", error);
      }
    };

    fetchWatchlist();
  }, [user]);

  // ✅ Remove recipe from watchlist
  const removeFromWatchlist = async (recipe) => {
    if (!user) return;

    try {
      const userRef = doc(db, "Recipe", user.uid);
      await updateDoc(userRef, {
        watchlist: arrayRemove(recipe),
      });
      setWatchlist((prev) => prev.filter((r) => r.id !== recipe.id));
      setPopupMessage(`❌ ${recipe.name} removed from watchlist!`);
      setShowPopup(true);
    } catch (error) {
      console.error("Failed to remove from watchlist", error);
      setPopupMessage("❌ Failed to remove recipe");
      setShowPopup(true);
    }
  };

  if (!user) {
    return <p>Please login to view your watchlist!</p>;
  }

  return (
    <div className="search-container">
      <h2 className="search-title">⭐ My Watchlist</h2>

      <PopUp
        show={showPopup}
        message={popupMessage}
        onClose={() => setShowPopup(false)}
      />

      {watchlist.length === 0 ? (
        <p>No recipes in your watchlist yet.</p>
      ) : (
        <div className="recipe-grid">
          {watchlist.map((recipe, i) => (
            <div
              key={i}
              className="recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <img src={recipe.image} alt={recipe.name} />
              <h4>{recipe.name}</h4>

              <button
                className="watchlist-btn remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(recipe);
                }}
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <div className="details">
          <div className="recipe-details">
            <h2>{selectedRecipe.name}</h2>

            <div className="Recipe-content">
              <img src={selectedRecipe.image} alt={selectedRecipe.name} />
              <div className="recipe-data">
                <p>
                  <b>Cuisine:</b> {selectedRecipe.cuisine}
                </p>
                <p>
                  <b>Difficulty:</b> {selectedRecipe.difficulty}
                </p>

                <h3>Ingredients</h3>
                <ul>
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>

                {selectedRecipe.instructions && (
                  <>
                    <h3>Instructions</h3>
                    <p>{selectedRecipe.instructions}</p>
                  </>
                )}
              </div>
            </div>

            <div className="close">
              <button onClick={() => setSelectedRecipe(null)}>❌ Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;

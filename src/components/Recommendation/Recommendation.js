// src/components/Recommendation/Recommendation.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PopUp from "../PopUp/PopUp";

const Recommendation = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch user watchlist
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

  // ✅ Fetch recommended recipes based on watchlist
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (watchlist.length === 0) return;

      try {
        const cuisines = [...new Set(watchlist.map((r) => r.cuisine))];
        const ingredients = [...new Set(watchlist.flatMap((r) => r.ingredients))];

        const res = await fetch(`https://dummyjson.com/recipes?limit=100`);
        const data = await res.json();
        const allRecipes = data.recipes || [];

        const recs = allRecipes.filter((recipe) => {
          if (watchlist.some((r) => r.id === recipe.id)) return false;
          return (
            cuisines.includes(recipe.cuisine) ||
            recipe.ingredients.some((ing) => ingredients.includes(ing))
          );
        });

        setRecommendations(recs);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      }
    };
    fetchRecommendations();
  }, [watchlist]);

  // ✅ Add recipe to watchlist
  const addToWatchlist = async (recipe) => {
    if (!user) {
      setPopupMessage("⚠ Please login to add to watchlist!");
      setShowPopup(true);
      return;
    }

    // Check if recipe already exists
    if (watchlist.some((r) => r.id === recipe.id)) {
      setPopupMessage(`ℹ️ ${recipe.name} is already in your watchlist!`);
      setShowPopup(true);
      return;
    }

    try {
      const userRef = doc(db, "Recipe", user.uid);
      await setDoc(userRef, { watchlist: arrayUnion(recipe) }, { merge: true });
      setPopupMessage(`✅ ${recipe.name} added to watchlist!`);
      setShowPopup(true);

      // Update local watchlist state immediately
      setWatchlist((prev) => [...prev, recipe]);
    } catch (error) {
      console.error("Failed to add to watchlist", error);
      setPopupMessage("❌ Failed to add to watchlist");
      setShowPopup(true);
    }
  };

  if (!user) {
    return <p>Please login to see personalized recommendations!</p>;
  }

  return (
    <div className="search-container">
      <h2 className="search-title">💡 Recommended Recipes</h2>

      <PopUp
        show={showPopup}
        message={popupMessage}
        onClose={() => setShowPopup(false)}
      />

      {recommendations.length === 0 ? (
        <p>No recommendations available yet. Add some recipes to your watchlist!</p>
      ) : (
        <div className="recipe-grid">
          {recommendations.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <img src={recipe.image} alt={recipe.name} />
              <h4>{recipe.name}</h4>

              <button
                className="watchlist-btn"
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening details
                  addToWatchlist(recipe);
                }}
              >
                ⭐ Add to Watchlist
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

export default Recommendation;

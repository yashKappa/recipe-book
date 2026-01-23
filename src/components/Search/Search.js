import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, arrayUnion, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Search.css";
import PopUp from "../PopUp/PopUp"; // ✅ import

const Search = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [user, setUser] = useState(null);
// Inside component
const [popupMessage, setPopupMessage] = useState("");
const [showPopup, setShowPopup] = useState(false);
  const limit = 15;

  // ✅ Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      let url = "";
      if (query.trim()) {
        url = `https://dummyjson.com/recipes/search?q=${encodeURIComponent(
          query
        )}`;
      } else {
        url = `https://dummyjson.com/recipes?limit=${limit}&skip=${
          page * limit
        }`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setRecipes(data.recipes || []);
        setSelectedRecipe(null);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
      }
    };

    fetchRecipes();
  }, [page, query]);

  // ✅ Add recipe to user's watchlist
  // ✅ Add recipe to user's watchlist with duplicate check
const addToWatchlist = async (recipe) => {
  if (!user) {
    setPopupMessage("⚠ Please login to add to watchlist!");
    setShowPopup(true);
    return;
  }

  try {
    const userRef = doc(db, "Recipe", user.uid);
    const docSnap = await getDoc(userRef);

    let existingWatchlist = [];
    if (docSnap.exists()) {
      existingWatchlist = docSnap.data().watchlist || [];
    }

    // Check if recipe already exists
    const alreadyExists = existingWatchlist.some(
      (r) => r.id === recipe.id
    );

    if (alreadyExists) {
      setPopupMessage(`ℹ ${recipe.name} is already in your watchlist!`);
      setShowPopup(true);
      return;
    }

    // Add new recipe to watchlist
    await setDoc(
      userRef,
      { watchlist: arrayUnion(recipe) },
      { merge: true }
    );
    setPopupMessage(`✅ ${recipe.name} added to watchlist!`);
    setShowPopup(true);
  } catch (error) {
    console.error("Failed to add to watchlist", error);
    setPopupMessage("❌ Failed to add to watchlist");
    setShowPopup(true);
  }
};


  // Scroll to top whenever page changes
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [page]);


  return (
    <div className="search-container">
      <h2 className="search-title">🍽 Recipe Search</h2>

<PopUp
  show={showPopup}
  message={popupMessage}
  onClose={() => setShowPopup(false)}
/>


      <div className="search-box">
        <input
          type="text"
          placeholder="Search recipe..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
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
                e.stopPropagation(); // Prevent opening recipe details
                addToWatchlist(recipe);
              }}
            >
              ⭐ Add to Watchlist
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
  <button
    onClick={() => {
      setPage((p) => Math.max(p - 1, 0));
      window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll to top
    }}
    disabled={page === 0}
  >
    ⬅ Prev
  </button>

  <span> Page {page + 1} </span>

  <button
    onClick={() => {
      setPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll to top
    }}
  >
    Next ➡
  </button>
</div>

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

                   {selectedRecipe.instructions && (
            <>
              <h3>Instructions</h3>
              <p>{selectedRecipe.instructions}</p>
            </>
          )}
                </ul>
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

export default Search;

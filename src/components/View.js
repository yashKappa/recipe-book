// src/components/View.js
import React, { useEffect, useState } from 'react';
import "./view.css";

function View() {
  const [recipes, setRecipes] = useState([]);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('recipes')) || [];
    setRecipes(data);
  }, []);

  const deleteRecipe = (id) => {
    const updated = recipes.filter(r => r.id !== id);
    localStorage.setItem('recipes', JSON.stringify(updated));
    setRecipes(updated);
  };

  const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className='view-container'>
      <h3 className="mb-4"> 🍲 All Recipes</h3>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="🔍 Search by recipe name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {viewRecipe ? (
        <div className="cards p-4">
         <div className='card-data'>
         <h3> 🎯 {viewRecipe.name} Recipe</h3>
          <div className='View-img'>
          <img src={viewRecipe.image} alt="recipe" className="img-fluid mb-3 view" />
          </div>
          <h4>🎯 {viewRecipe.name}</h4>
          <p><strong>🥗 Ingredients:</strong></p>
          <p>{viewRecipe.ingredients}</p>
          <p><strong>👩‍🍳 Steps:</strong></p>
          <ul>{viewRecipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ul>
          <button className="btn btn-secondary mt-3" onClick={() => setViewRecipe(null)}>Back</button>
         </div>
        </div>
      ) : (
        <div className="recipe-grid">
  {filteredRecipes.map(recipe => (
    <div className="card" key={recipe.id}>
      <img src={recipe.image} className="card-img-top" alt={recipe.name} style={{ height: '200px', objectFit: 'cover' }} />
      <div className="card-body">
        <h5 className="card-title">🎯 {recipe.name}</h5>
        <button className="btn btn-primary" onClick={() => setViewRecipe(recipe)}>👁️‍🗨️ View</button>
        <button className="btn btn-danger mt-2" onClick={() => deleteRecipe(recipe.id)}>🗑️ Delete</button>
      </div>
    </div>
  ))}
</div>

      )}
    </div>
  );
}

export default View;

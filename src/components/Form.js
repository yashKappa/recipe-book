import React, { useState } from 'react';
import "./form.css";

function Form() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState(['']);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const addStep = () => setSteps([...steps, '']);

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!name || !ingredients || steps.some(step => !step) || !image) {
      setError('Please fill all fields and upload an image.');
      return;
    }

    const recipe = {
      id: Date.now(),
      name,
      ingredients,
      steps,
      image
    };

    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    setName('');
    setIngredients('');
    setSteps(['']);
    setImage(null);
    setError('');
    alert('Recipe added!');
  };

  return (
    <div className="card p-4 shadow">
      <h3>❇️ Add Recipe</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <label className="form-label">📝 Recipe Name</label>
        <input className="form-control" placeholder='Matar Paneer' value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">🥗 Ingredients</label>
        <textarea className="form-control" 
        placeholder='Broccoli, Tomato, Salt, ... etc'
        value={ingredients} onChange={e => setIngredients(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">👩‍🍳 Preparation Steps</label>
        {steps.map((step, index) => (
          <input key={index} className="form-control mb-2" value={step} onChange={e => handleStepChange(index, e.target.value)} placeholder={`Step ${index + 1}`} />
        ))}
        <button className="btn btn-outline-secondary btn-sm" onClick={addStep}>+ Add Step</button>
      </div>

      <div className="mb-3">
      <label className="form-label">🖼️ Upload Image (Please upload a horizontal image for best results)</label>
      <input type="file" className="form-control" onChange={handleImageChange} />
        {image && <img src={image} alt="Recipe preview" className="mt-3" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>✔️	Submit Recipe</button>
    </div>
  );
}

export default Form;

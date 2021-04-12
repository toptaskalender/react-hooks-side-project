import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // componentDidMount with [] - componentDidUpdate without []
  useEffect(() => {
    console.log('INGREDIENTS HAS CHANGED!');
  }, [ingredients]);

  const addIngredientHandler = newIngredient => {
    setIsLoading(true);
    fetch(
      'https://react-hooks-side-project-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(newIngredient),
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then(res => res.json())
      .then(resData => {
        setIsLoading(false);
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: resData.name, ...newIngredient },
        ]);
      })
      .catch(error => {
        setIsLoading(false);
        setError(error.message);
      });
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-side-project-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: 'DELETE',
      }
    ).then(res => {
      setIsLoading(false);

      setIngredients(prevIngredients => {
        const ingredients = [...prevIngredients];
        const index = ingredients.findIndex(ing => ing.id === id);
        ingredients.splice(index, 1);
        return ingredients;
      });
    });
  };

  const filterChangeHandler = useCallback(
    filteredIngredients => {
      setIngredients(filteredIngredients);
    },
    [setIngredients]
  );

  const closeHandler = () => {
    setError();
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeHandler}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      <section>
        <Search onFilterChange={filterChangeHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

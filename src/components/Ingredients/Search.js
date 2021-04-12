import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onFilterChange } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const currentFilterValue = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === currentFilterValue.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch(
          'https://react-hooks-side-project-default-rtdb.firebaseio.com/ingredients.json' +
            query
        )
          .then(res => res.json())
          .then(resData => {
            const fetchedIngs = [];
            for (let key in resData) {
              fetchedIngs.push({
                id: key,
                title: resData[key].title,
                amount: resData[key].amount,
              });
            }
            onFilterChange(fetchedIngs);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onFilterChange, currentFilterValue]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={currentFilterValue}
            type="text"
            value={enteredFilter}
            onChange={e => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;

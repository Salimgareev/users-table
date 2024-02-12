import React from "react";
import "./App.css";

function App() {
  const fetcher = (...args) => {fetch('https://dummyjson.com/users')
  .then(res => res.json())
  .then(console.log)};

  fetcher();

  return (
    <div className="wrapper">
      <div className="container">
        <h1>React v{React.version}</h1>
        <input type="text" placeholder="Поиск элемента"/>
      </div>
    </div>
  );
}

export default App;

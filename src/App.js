import React from "react";
import "./App.css";
import Table from "./components/ui/Table";

function App() {
  

  async function fetcher() {
    try {
      const response = await fetch("https://dummyjson.com/users");
      const data = await response.json();
      const mas = []; // создаем пустой массив

      mas.push(data);

      console.log(mas[0].users[0].lastName);
      return mas // возвращаем массив для дальнейшего использования
    } catch (error) {
      console.log(error);
      return null; // в случае ошибки возвращаем null
    }
  }

  fetcher();

  const theadData = ["Name", "Email", "Date"];

  const tbodyData = [
    {
      id: "1",
      items: ["John", "john@email.com", "01/01/2021"],
    },
    {
      id: "2",
      items: ["Sally", "sally@email.com", "12/24/2020"],
    },
    {
      id: "3",
      items: ["Maria", "maria@email.com", "12/01/2020"],
    },
  ];

  return (
    <div className="wrapper">
      <div className="container">
        <h1>React v{React.version}</h1>
        <input type="text" placeholder="Поиск элемента" />
        <Table
          theadData={theadData}
          tbodyData={tbodyData}
          customClass={"main-table"}
        />
      </div>
    </div>
  );
}

export default App;

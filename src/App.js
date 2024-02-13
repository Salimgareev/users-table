import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./components/ui/Table";

function App() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://dummyjson.com/users");
        const data = await response.json();
        setUserData(data.users);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const theadData = ["ФИО", "Возраст", "Пол", "Номер телефона", "Адрес"];

  // Функция, которая преобразует данные пользователя в нужный формат для таблицы
  const formatUserDataForTable = () => {
    return userData.map((user) => ({
      id: user.id,
      items: [
        `${user.firstName} ${user.lastName}`,
        user.age,
        user.gender,
        user.phone,
        `${user.address.city}, ${user.address.street}`,
      ],
    }));
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1>React v{React.version}</h1>
        <input type="text" placeholder="Поиск элемента" />
        <Table
          theadData={theadData}
          tbodyData={formatUserDataForTable()}
          customClass={"main-table"}
        />
      </div>
    </div>
  );
}

export default App;

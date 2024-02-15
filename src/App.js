import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./components/ui/Table";
import useDebounce from "./hooks/UseDebounce";

function App() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("https://dummyjson.com/users");
        const data = await response.json();
        setUserData(data.users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState();
  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    async function fetchNewData() {
      setLoading(true);
      let url;
      if (debounceSearch.trim() === "") {
        // Если строка поиска пустая, делаем запрос без фильтрации
        url = "https://dummyjson.com/users";
      } else {
        url = `https://dummyjson.com/users/filter?key=firstName&value=${debounceSearch}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data.users);
      setLoading(false);
    }

    fetchNewData();
  }, [debounceSearch]);

  return (
    <div className="wrapper">
      <div className="container">
        <h1>React v{React.version}</h1>
        <input
          type="text"
          placeholder="Поиск элемента"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table
          theadData={theadData}
          tbodyData={formatUserDataForTable()}
          customClass={"main-table"}
        />
        {loading && (
          <div className="loading-overlay">
            <div className="loading-indicator"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

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

  const theadData = [
    "Имя Фамилия",
    "Возраст",
    "Пол",
    "Номер телефона",
    "Адрес",
  ];

  // Функция, которая преобразует данные пользователя в нужный формат для таблицы
  const formatUserDataForTable = () => {
    return userData.map((user) => ({
      id: user.id,
      items: [
        `${user.firstName} ${user.lastName}`,
        user.age,
        user.gender,
        user.phone,
        `${user.address.city}, ${user.address.address}`,
      ],
    }));
  };

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState();
  const debounceSearch = useDebounce(search, 600);

  useEffect(() => {
    async function fetchNewData() {
      setLoading(true);
      let url;
      let queryKey;
      let queryValue;

      if (debounceSearch.trim() === "") {
        // Если строка поиска пустая, делаем запрос без фильтрации
        url = "https://dummyjson.com/users";
      } else {
        // Проверяем введенные данные
        if (
          !isNaN(debounceSearch.trim()) &&
          Number(debounceSearch.trim()) >= 1 &&
          Number(debounceSearch.trim()) <= 500
        ) {
          // Если введено число от 1 до 500, считаем это возрастом
          queryKey = "age";
          queryValue = Number(debounceSearch.trim());
        } else if (
          debounceSearch.trim() === "male" ||
          debounceSearch.trim() === "female"
        ) {
          // Если введено "male" или "female", считаем это полом
          queryKey = "gender";
          queryValue = debounceSearch.trim();
        } else {
          // В остальных случаях считаем, что введено имя или фамилия
          // Отправляем два запроса - один с именем, другой с фамилией
          let firstName = "";
          let lastName = "";
          // Если строка содержит внутри пробел, но не содержит цифр
          if (
            /\s/.test(debounceSearch.trim()) &&
            !/\d/.test(debounceSearch.trim())
          ) {
            [firstName, lastName] = debounceSearch.trim().split(" ");
          } else {
            firstName = debounceSearch.trim();
            lastName = firstName;
          }

          if (firstName !== lastName) {
            const firstNameResponse = await fetch(
              `https://dummyjson.com/users/filter?key=firstName&value=${firstName}`
            );
            const firstNameData = await firstNameResponse.json();
            setUserData(firstNameData.users);
            setLoading(false);
            return;
          }

          const firstNameResponse = await fetch(
            `https://dummyjson.com/users/filter?key=firstName&value=${firstName}`
          );
          const firstNameData = await firstNameResponse.json();
          const lastNameResponse = await fetch(
            `https://dummyjson.com/users/filter?key=lastName&value=${lastName}`
          );
          const lastNameData = await lastNameResponse.json();
          // Объединяем данные из двух запросов
          const combinedData = firstNameData.users.concat(lastNameData.users);

          if (combinedData.length === 0) {
            const address = debounceSearch.trim();
            const addressCityResponse = await fetch(
              `https://dummyjson.com/users/filter?key=address.city&value=${address}`
            );
            const addressCityData = await addressCityResponse.json();
            setUserData(addressCityData.users);
            setLoading(false);
            return;
          }

          setUserData(combinedData);
          setLoading(false);
          return;
        }
        // Формируем URL запроса в зависимости от определенного типа данных
        url = `https://dummyjson.com/users/filter?key=${queryKey}&value=${queryValue}`;
      }
      // Отправляем запрос
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

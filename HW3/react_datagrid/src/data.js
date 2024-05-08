import React, { useState, useEffect } from 'react';

const App = () => {
  const [dataset, setDataset] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6');
        const jsonData = await response.json();
        setDataset(jsonData);
        setFilteredData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addNewData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = data.slice(startIndex, endIndex);

    return (
      <tbody>
        {paginatedData.map((item, index) => (
          <tr key={index}>
            <td>{item.title}</td>
            <td>{item.showInfo[0].location}</td>
            <td>{item.showInfo[0].price}</td>
          </tr>
        ))}
      </tbody>
    );
  };

  const nextPage = () => {
    if (document.getElementById("searchInput").value !== "") {
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      const totalPages = Math.ceil(dataset.length / itemsPerPage);
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const searchByName = () => {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    if (searchInput === "") {
      setFilteredData(dataset);
    } else {
      const filtered = dataset.filter(data =>
        data.title.toLowerCase().includes(searchInput)
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  return (
    <div>
      
      <h1>景點觀光展覽資訊<input type="text" id="searchInput" placeholder="輸入名稱搜索" onChange={searchByName} /></h1>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>名稱</th>
            <th>地點</th>
            <th>票價</th>
          </tr>
        </thead>
        {addNewData(filteredData, currentPage)}
      </table>
      <div id="controls">
        <button onClick={prevPage}>上一頁</button>
        <span id="pagination">{currentPage} / {Math.ceil(filteredData.length / itemsPerPage)}頁</span>
        <button onClick={nextPage}>下一頁</button>
      </div>
    </div>
  );
};

export default App;

import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/Logo.png';

const Container = styled.div`
  @media print {
    margin: 20px;
  }

  h1 {
    color: #164863;
    text-align: center;
  }
`;

const ItemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  table-layout: fixed;

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    overflow-wrap: break-word;
    word-break: break-word;
    font-size: 18px;
  }

  th {
    background-color: #164863;
    color: white;
    font-size: 15px;
    font-weight: bold;
  }

  tbody tr {
    background-color: #f9f9f9;
  }

  tbody tr:nth-child(even) {
    background-color: #f1f1f1;
  }

  tbody tr:hover {
    background-color: #e0f7fa;
    color: #000;
  }

  td input {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    font-size: 14px;
    width: 90%;
  }

  td select {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    font-size: 14px;
    min-width: 180px;
  }

  .sno {
    min-width: 50px;
  }

  @media print {
    th, td {
      font-size: 11px; 
    }
  }
`;

const DateRange = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 20px;
  }
`;

const PrintHeader = styled.div`
  display: none;
  text-align: center;
  margin-bottom: 20px;
  img {
    width: 150px;
    height: auto;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 30px;
  }

  @media print {
    display: block;
  }
`;

export const CategoryReport = React.forwardRef(({ fromDate, toDate }, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3002/category/report', {
      params: {
        fdate: fromDate,
        tdate: toDate
      }
    })
    .then(res => {
      setData(res.data || []);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching report data:", err);
      setLoading(false);
    });
  }, [fromDate, toDate]);

  const formatNumber = (number) => {
    return Number(number).toFixed(2);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container ref={ref} className="print-container">
      <PrintHeader>
        <img src={Logo} alt="College Logo" />
        <h1>College Name</h1>
      </PrintHeader>
      <h1>Category Report</h1>
      <DateRange>
        <h2>From: {fromDate}</h2>
        <h2>To: {toDate}</h2>
      </DateRange>
      <ItemTable>
        <thead>
          <tr>
            <th>Category Name</th>
            <th>RMK</th>
            <th>RMD</th>
            <th>RMKCET</th>
            <th>School</th>
            <th>Issue Total</th>
            <th>Purchase Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.category}</td>
              <td>{formatNumber(row.RMK_amount)}</td>
              <td>{formatNumber(row.RMD_amount)}</td>
              <td>{formatNumber(row.RMKCET_amount)}</td>
              <td>{formatNumber(row.RMKSCHOOL_amount)}</td>
              <td>{formatNumber(row.total_amount)}</td>
              <td>{formatNumber(row.purchase_amount)}</td>
            </tr>
          ))}
        </tbody>
      </ItemTable>
    </Container>
  );
});

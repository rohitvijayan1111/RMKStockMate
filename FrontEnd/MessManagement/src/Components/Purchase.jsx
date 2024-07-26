import React, { useState, useRef, useEffect  } from 'react';
import styled from 'styled-components';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
const Container = styled.div`
  h1 {
    color: #164863;
    text-align: center;
    font-weigth:800;
  }
`;

const FormContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 450px;
`;

const Records = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-left: 12px;
  }
`;

const InputNumber = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f4f4f4;
  margin-left: 10px;
  margin-top:24px;
  width:190px;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #164863;
  color: white;
  cursor: pointer;
  font-size: 14px;
  margin-top: 24px;
  margin-left: 10px;

  &:hover {
    background-color: #0a3d62;
  }
`;

const ItemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    transition: background-color 0.3s, color 0.3s;
  }

  th {
    background-color: #164863;
    color: white;
    font-size: 16px;
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
    border: none;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
  }

  td input:focus {
    outline: 2px solid #164863;
  }

  .item-select {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
  }

  .sno {
    min-width: 50px;
  }
`;

const SubmitContainer = styled.div`
  margin-top: 20px;
  text-align: center;

  .add-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #164863;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    margin-right: 10px;

    &:hover {
      background-color: #0a3d62;
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Purchase = () => {
  const [rows, setRows] = useState([{ id: Date.now(), sno: 1, quantity: '', amount: '' }]);
  const numRecordsRef = useRef(null);
  const [date, setDate] = useState(null);
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching items...");
        const response = await axios.get("http://localhost:3002/purchase/getItems");
        console.log("Items fetched:", response.data);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const fetchCategoryForItem = (itemName) => {
    const item = items.find(i => i.item === itemName);
    return item ? item.category : '';
  };

  const handleAddRows = () => {
    const numberOfRows = parseInt(numRecordsRef.current.value, 10);
    if (numberOfRows > 0) {
      const lastSno = rows.length > 0 ? rows[rows.length - 1].sno : 0;
      const newRows = Array.from({ length: numberOfRows }, (_, index) => ({
        id: Date.now() + index,
        sno: lastSno + index + 1,
        id: Date.now() + index,
        sno: lastSno + index + 1,
        quantity: '',
        amount: '',
        item: '',
        category: ''
      }));
      setRows(prevRows => [...prevRows, ...newRows]);
      numRecordsRef.current.value = '';
      numRecordsRef.current.value = '';
    }
  };

  const handleInputChange = (id, field, value) => {
    if (field === 'item') {
      const category = fetchCategoryForItem(value);
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === id ? { ...row, [field]: value, category } : row
        )
      );
    } else {
      const numericValue = value === '' ? 0 : parseFloat(value);
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === id ? { ...row, [field]: numericValue, totalAmount: (row.quantity || 0) * (row.amount || 0) } : row
        )
      );
    }
  };

  const handleAddOneRow = () => {
    const lastSno = rows.length > 0 ? rows[rows.length - 1].sno : 0;
    setRows(prevRows => [
      ...prevRows,
      { id: Date.now(), sno: lastSno + 1, quantity: '', amount: '' }
    ]);
  };

  const handleSubmit = async () => {
    if (!date) {
      alert("Please enter the date.");
      return;
    }

    // Format date to YYYY-MM-DD format
    const formattedDate = date.format('YYYY-MM-DD');

    // Prepare data to send
    const formattedRows = rows.map(row => ({
      ...row,
      amount: isNaN(row.amount) ? 0 : row.amount,
      quantity: isNaN(row.quantity) ? 0 : row.quantity,
      totalAmount: isNaN(row.totalAmount) ? 0 : row.totalAmount // Ensure totalAmount is valid
    }));

    try {
      console.log("Submitting data...", { date: formattedDate, arr: formattedRows });
      const response = await axios.post('http://localhost:3002/purchase/add', {
        date: formattedDate,
        arr: formattedRows
      });
      console.log("Response from server:", response.data);
      alert("Items added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };


  return (
    <Container>
      <h1>PURCHASE</h1>
      <FormContainer>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Basic date picker" className="date-picker" onChange={(newDate) => setDate(newDate)}
            value={date}
            format="YYYY-MM-DD" />
          </DemoContainer>
        </LocalizationProvider>
        <Records>
          <InputNumber
            type='number'
            id='num-records'
            placeholder='No of rows to be added'
            ref={numRecordsRef}
          />
        </Records>
        <AddButton onClick={handleAddRows}>Add</AddButton>
      </FormContainer>
      <ItemTable>
        <thead>
          <tr>
            <th>SNo</th>
            <th>Select Item</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td className='sno'>{row.sno}</td>
              <td>
              <select
                  className="item-select"
                  value={row.item}
                  onChange={(e) => handleInputChange(row.id, 'item', e.target.value)}
                >
                  <option value="">SELECT</option>
                  {items.map((item, idx) => (
                    <option key={idx} value={item.item}>
                      {item.item}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className="item-input"
                  placeholder="Category"
                  value={row.category}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  className="item-input"
                  placeholder="Quantity"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="item-input"
                  placeholder="Amount"
                  value={row.amount}
                  onChange={(e) => handleInputChange(row.id, 'amount', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="item-input"
                  placeholder="Total Amount"
                  value={(row.quantity || 0) * (row.amount || 0)}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
        
      </ItemTable>
      <SubmitContainer>
      <SubmitButton className="add-button" onClick={handleAddOneRow}>Add</SubmitButton>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </SubmitContainer>
    </Container>
  );
};

export default Purchase;

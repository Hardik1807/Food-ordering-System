import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import io from 'socket.io-client';
import Table from './Table';
import toast from 'react-hot-toast'
import './Admin.css'

const contentStyle = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '1200px',
};

const headerStyle = {
  backgroundColor: '#28a745',
  color: '#fff',
  padding: '20px',
  textAlign: 'center',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  marginBottom: '20px',
  position: 'relative',
};

const socket = io('http://localhost:5000');

const Admin = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate(); // Use useNavigate for redirection

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error("Login with admin username and password first")
      navigate('/login'); // Redirect to login if user is not found
    }
  }, [navigate]);

  // Fetch table data on component mount
  useEffect(() => {
    const fetchTablesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/tables', {
          method: 'GET',
        });
        const data = await response.json();
        setTables(data);
        console.log('Fetched tables data:', data);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };
    fetchTablesData();
  }, []); // Empty dependency array means this useEffect runs once on mount

  // Socket.io listener
  useEffect(() => {
    const handleOrderUpdate = (data) => {
      console.log('Order update from server:', data);
      setTables(prevTables => {
        // Check if the new order data updates any table
        const tableExists = prevTables.some(table => table.Table === data.Table);
        if (tableExists) {
          return prevTables.map(table => 
            table.Table === data.Table 
              ? { ...table, order_data: data.order_data } 
              : table
          );
        } else {
          // If the table does not exist in the current state, add it
          return [...prevTables, { Table: data.Table, order_data: data.order_data }];
        }
      });
    };

    socket.on('orderUpdate', handleOrderUpdate);

    return () => {
      socket.off('orderUpdate', handleOrderUpdate);
    };
  }, []); // Empty dependency array means this useEffect runs once on mount

  const handleMarkPaid = async (tableId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/markPaid/${tableId}`, {
        method: 'POST',
      });

      const d = await res.json()
      // console.log("Hi",d)
      alert(d.message)

      const response = await fetch('http://localhost:5000/api/auth/tables', {
        method: 'GET',
      });
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const handleAddOrDeleteDishes = () => {
    navigate('/admin_panel/addDishes');
  };

  return (
    <div style={contentStyle}>
      <header style={headerStyle}>
        <h1>Admin Panel - Orders</h1>
        <button className='a' onClick={handleAddOrDeleteDishes}>Add Dishes</button>
      </header>
      <main>
        {tables.map((table) => (
          <Table key={table.Table} table={table} onMarkPaid={handleMarkPaid} />
        ))}
      </main>
    </div>
  );
};

export default Admin;

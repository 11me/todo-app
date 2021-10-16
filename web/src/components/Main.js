import { useState, useEffect } from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Input from './Input';
import TodoItem from './Todo'

const Main = () => {
  const [todos, setTodos] = useState([])
  const addTodo = (text) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/api/create',
      data: {
        name: text,
        done: false
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      setTodos((prevTodos) => [...prevTodos, {id: res.data, name: text, done: false}])
    })

  }

  useEffect(() => {
    axios.get("http://localhost:3001/api/todos")
      .then(res => {
        setTodos(prevTodos => [...res.data])
      })
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" margin="dense">
        <Input addTodo={addTodo} />
        <TodoItem todos={todos} setTodos={setTodos}/>
      </Container>
    </>
  );
}

export default Main;

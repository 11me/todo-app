import { useState, useEffect } from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Input from './Input';
import TodoItem from './Todo';
import HOST from '../config';

const Main = () => {
  const [todos, setTodos] = useState([])
  const addTodo = (text) => {
    axios({
      method: 'post',
      url: `${HOST}/api/create`,
      data: {
        name: text,
        done: false
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      setTodos((prevTodos) => [{id: res.data, name: text, done: false}, ...prevTodos])
    })

  }

  useEffect(() => {
    axios.get(`${HOST}/api/todos`)
      .then(res => {
        if (res.data) {
          setTodos(prevTodos => [...res.data])
        }else {
          setTodos([])
        }
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

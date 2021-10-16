import { useState, useEffect } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios'

const TodoItem = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3001/api/todos").
      then(res => {
        setTodos(prevTodos => [...res.data])
      })
  }, []);

  const toggleTodo = e => {
    const updatedTodods = [...todos].map(todo => {
      if (todo.id.toString() === e.target.id) {
        todo.done = !todo.done
      }
      return todo
    })
    setTodos(updatedTodods)
    axios({
      method: 'patch',
      url: `http://localhost:3001/api/update/${e.target.id}`,
      data: {
        name: e.target.value,
        done: e.target.checked
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      }
    })
  }
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {todos.map((todo, i) => {
        const labelId = `checkbox-list-label-${todo.id}`;

        return (
          <ListItem
            key={todo.id}
            secondaryAction={
                <ButtonGroup variant="contained">
                  <Button size="small" variant="outlined" color="success">Edit</Button>
                  <Button size="small" variant="outlined" color="error">Delete</Button>
                </ButtonGroup>
            }
          >
            <Checkbox
              id={(todo.id).toString()}
              value={todo.name}
              checked={todo.done}
              onChange={e => toggleTodo(e)}
            />
            <ListItemButton dense>
              <ListItemText id={labelId} primary={`${todo.name}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
export default TodoItem

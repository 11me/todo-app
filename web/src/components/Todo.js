import { useState, useEffect } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
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
  const handleCheck = e => {
    axios({
      methods: 'post',
      url: `http://localhost:3001/api/update/${e.target.id}`,
      data: {
        name: e.target.name,
        done: e.target.checked
      }
    })
  }
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {todos.map((todo) => {
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
              //onChange={e => handleCheck(e)}
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

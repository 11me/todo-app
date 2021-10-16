import { useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';

const Input = (props) => {
  const [inputText, setInputText] = useState("")
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, margin: 5}}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Add a new todo..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <Button
        variant="contained"
        color="success"
        onClick={e => {
          props.addTodo(inputText)
          setInputText("")
        }}>
          Save
        </Button>
    </Paper>
  );
}

export default Input;

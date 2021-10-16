import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

const Input = (props) => {
  const [inputText, setInputText] = useState("Add a new todo...")
  const updateText = text => setInputText(text)
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, margin: 5}}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <Button
        variant="contained"
        color="success"
        onClick={e => {
          props.addTodo(inputText)
        }}>
          Save
        </Button>
    </Paper>
  );
}

export default Input;

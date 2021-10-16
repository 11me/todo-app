import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Input = () => {
  return (
    <Box
      sx={{
        width: 500,
        maxWidth: '100%',
        margin: 5
      }}
    >
      <TextField fullWidth label="todo" id="todo" />

      <Button variant="contained" color="success" size="small">
        Add
      </Button>
    </Box>
  );
}

export default Input;

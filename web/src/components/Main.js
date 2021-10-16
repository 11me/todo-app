import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Input from './Input';
import TodoItem from './Todo'

const Main = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" margin="dense">
        <Input />
        <TodoItem />
      </Container>
    </>
  );
}

export default Main;

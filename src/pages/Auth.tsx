import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Auth = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (tab === 0) { // Login
        const response = await axios.post('http://localhost:8000/api/auth/login', {
          email,
          password
        });
        localStorage.setItem('token', response.data.access_token);
        navigate('/dashboard');
      } else { // Register
        await axios.post('http://localhost:8000/api/auth/register', {
          email,
          password,
          name
        });
        setSuccess('Registro exitoso. Por favor inicia sesión.');
        setTab(0);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ocurrió un error');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <TabPanel value={tab} index={0}>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
          </form>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrarse
            </Button>
          </form>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Auth;

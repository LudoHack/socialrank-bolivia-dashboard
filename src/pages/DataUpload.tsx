import React, { useState } from 'react';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  TextField,
  CircularProgress
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import axios from 'axios';

const DataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [datasetName, setDatasetName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !datasetName) {
      setError('Por favor selecciona un archivo y proporciona un nombre para el dataset');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataset_name', datasetName);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/data/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Archivo subido exitosamente');
      setFile(null);
      setDatasetName('');
      // Resetear el input de archivo
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al subir el archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Subir Datos
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nombre del Dataset"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            disabled={loading}
          />

          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 3,
              mt: 2,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
            onClick={() => document.querySelector('input[type="file"]')?.click()}
          >
            <input
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1" gutterBottom>
              {file ? file.name : 'Arrastra tu archivo aquí o haz clic para seleccionar'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Formatos soportados: CSV, Excel, JSON
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading || !file}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Subir Datos'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default DataUpload;

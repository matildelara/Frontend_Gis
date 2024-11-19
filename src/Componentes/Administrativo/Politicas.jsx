import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [newTitulo, setNewTitulo] = useState('');
  const [newContenido, setNewContenido] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editContenido, setEditContenido] = useState('');
  const [open, setOpen] = useState(false);

  // Obtener todas las políticas
  const fetchPoliticas = async () => {
    try {
      const response = await axios.get('https://backendgislive.onrender.com/api/getpolitica');
      setPoliticas(response.data);
    } catch (error) {
      console.error('Error al obtener las políticas', error);
    }
  };

  // Crear una nueva política
  const handleCreatePolitica = async () => {
    try {
      await axios.post('https://backendgislive.onrender.com/api/insert', {
        titulo: newTitulo,
        contenido: newContenido,
      });
      setNewTitulo('');
      setNewContenido('');
      fetchPoliticas();
    } catch (error) {
      console.error('Error al crear la política', error);
    }
  };

// Función para editar política
const handleUpdatePolitica = async (id) => {
  try {
    // Solicitud para actualizar política
    await axios.put(`https://backendgislive.onrender.com/api/update/${id}`, {
      titulo: editTitulo,
      contenido: editContenido,
    });
    // Limpia los datos del formulario
    setEditId(null);
    setEditTitulo('');
    setEditContenido('');
    setOpen(false); // Cierra el diálogo
    fetchPoliticas(); // Refresca la lista
  } catch (error) {
    console.error('Error al actualizar la política:', error);
  }
};

// Función para eliminar política (lógica)
const handleDeletePolitica = async (id) => {
  try {
    // Solicitud para eliminar (desactivar) política
    await axios.put(`https://backendgislive.onrender.com/api/deactivate/${id}`);
    fetchPoliticas(); // Refresca la lista
  } catch (error) {
    console.error('Error al eliminar la política:', error);
  }
};

// Abrir el diálogo de edición
const handleClickOpen = (politica) => {
  setEditId(politica.id); // ID de la política a editar
  setEditTitulo(politica.titulo); // Cargar título actual
  setEditContenido(politica.contenido); // Cargar contenido actual
  setOpen(true); // Abre el cuadro de diálogo
};

// Cerrar el diálogo de edición
const handleClose = () => {
  setOpen(false); // Cierra el cuadro de diálogo
  setEditTitulo('');
  setEditContenido('');
  setEditId(null);
};

  useEffect(() => {
    fetchPoliticas();
  }, []);

  return (
    <Container>
      <h1>Gestión de Políticas de Privacidad</h1>

      <TextField
        label="Título de la nueva política"
        variant="outlined"
        value={newTitulo}
        onChange={(e) => setNewTitulo(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Contenido de la nueva política"
        variant="outlined"
        value={newContenido}
        onChange={(e) => setNewContenido(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePolitica}
        style={{ marginBottom: '20px' }}
      >
        Agregar Política
      </Button>

      <TableContainer component={Paper} sx={{ backgroundColor: '#e3f2fd', marginTop: '20px' }}>
        <Table aria-label="tabla de politicas">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Título
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Contenido
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Versión
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Fecha de Creación
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Fecha de Actualización
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {politicas.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ textAlign: 'center' }}>{item.titulo}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {item.contenido}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.version}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{item.estado ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{new Date(item.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{new Date(item.fecha_actualizacion).toLocaleDateString()}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleClickOpen(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePolitica(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para editar política */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Política</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título de la política"
            type="text"
            fullWidth
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contenido de la política"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editContenido}
            onChange={(e) => setEditContenido(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => { handleUpdatePolitica(editId); handleClose(); }} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Politicas;

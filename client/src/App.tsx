import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Button,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import { CloudUpload, Delete, Download, Google } from '@mui/icons-material';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface FileItem {
  id: string;
  name: string;
  date: string;
  size: number;
  type: string;
}

export const App: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Logged in as:', result.user.displayName, result.user.email);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    console.log('User logged out');
  };

  // File manager state
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'Document1.pdf', date: '2025-12-01', size: 120, type: 'pdf' },
    { id: '2', name: 'Photo.png', date: '2025-11-30', size: 450, type: 'png' },
    { id: '3', name: 'Report.docx', date: '2025-12-02', size: 320, type: 'docx' },
    { id: '4', name: 'Presentation.pptx', date: '2025-12-03', size: 870, type: 'pptx' },
    { id: '5', name: 'Spreadsheet.xlsx', date: '2025-11-29', size: 150, type: 'xlsx' },
    { id: '6', name: 'Video.mp4', date: '2025-12-04', size: 10240, type: 'mp4' },
    { id: '7', name: 'Notes.txt', date: '2025-12-01', size: 50, type: 'txt' },
    { id: '8', name: 'Archive.zip', date: '2025-12-02', size: 2048, type: 'zip' },
    { id: '9', name: 'Design.ai', date: '2025-12-03', size: 5120, type: 'ai' },
  ]);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'size'>('date');

  const displayedFiles = useMemo(() => {
    let filtered = files;

    if (search) {
      filtered = filtered.filter((file) =>
        file.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((file) => file.type === filterType);
    }

    filtered = filtered.sort((a, b) => {
      if (sortField === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      else return b.size - a.size;
    });

    return filtered;
  }, [files, search, filterType, sortField]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files).map((file) => ({
      id: (Math.random() * 1000000).toString(),
      name: file.name,
      date: new Date().toISOString().split('T')[0],
      size: Math.round(file.size / 1024),
      type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDownload = (file: FileItem) => {
    alert(`Downloading: ${file.name}`);
  };

  const fileTypes = Array.from(new Set(files.map((f) => f.type)));

  // ---------- RENDER ----------
  if (!user) {
    // Show login button if not logged in
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" mb={2}>
          Please log in to access your files
        </Typography>
        <Button
          variant="contained"
          startIcon={<Google />}
          onClick={handleLogin}
          sx={{ borderRadius: 6, px: 4 }}
        >
          Sign in with Google
        </Button>
      </Container>
    );
  }

  // Logged-in view
  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Welcome, {user.displayName}</Typography>
        <Button variant="outlined" onClick={handleLogout} sx={{ borderRadius: 5 }}>
          Logout
        </Button>
      </Box>

      {/* Controls */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems="center">
        <TextField
          label="Search files"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 380,
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
            },
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={filterType}
            label="Filter Type"
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ borderRadius: 5 }}
          >
            <MenuItem value="all">All</MenuItem>
            {fileTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortField}
            label="Sort By"
            onChange={(e) => setSortField(e.target.value as 'date' | 'size')}
            sx={{ borderRadius: 5 }}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="size">Size</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Files */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        {displayedFiles.map((file) => (
          <Paper
            key={file.id}
            elevation={3}
            sx={{
              width: 180,
              height: 140,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              wordBreak: 'break-word',
              borderRadius: 5,
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {file.name}
            </Typography>
            <Typography variant="caption">{file.date}</Typography>
            <Typography variant="caption">{file.size} KB</Typography>

            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => handleDownload(file)} sx={{ borderRadius: 5 }}>
                <Download fontSize="small" />
              </Button>
              <Button size="small" onClick={() => handleDelete(file.id)} sx={{ borderRadius: 5 }}>
                <Delete fontSize="small" />
              </Button>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* Floating Upload Button */}
      <Box sx={{ position: 'fixed', bottom: 24, left: 24 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          sx={{ borderRadius: 6, px: 3 }}
        >
          Upload Files
          <input type="file" hidden multiple onChange={handleUpload} />
        </Button>
      </Box>
    </Container>
  );
};

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useHuntingTrip } from '../../context/HuntingTripContext';
import { PackingCategory, PackingItem } from '../../types';

const PackingList: React.FC = () => {
  const { 
    currentTrip, 
    addPackingItem, 
    updatePackingItem, 
    deletePackingItem, 
    togglePackingItem 
  } = useHuntingTrip();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: PackingCategory.OTHER,
    isRequired: false,
    notes: ''
  });

  const [filterCategory, setFilterCategory] = useState<PackingCategory | 'all'>('all');

  const handleAddItem = () => {
    if (!currentTrip) return;
    
    if (editingItem) {
      updatePackingItem(currentTrip.id, editingItem.id, formData);
    } else {
      addPackingItem(currentTrip.id, {
        ...formData,
        isPacked: false
      });
    }
    
    handleCloseDialog();
  };

  const handleEditItem = (item: PackingItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      isRequired: item.isRequired,
      notes: item.notes || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      category: PackingCategory.OTHER,
      isRequired: false,
      notes: ''
    });
  };

  if (!currentTrip) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Please select or create a trip to manage your packing list.
        </Alert>
      </Box>
    );
  }

  const filteredItems = filterCategory === 'all' 
    ? currentTrip.packingList
    : currentTrip.packingList.filter(item => item.category === filterCategory);

  const groupedItems = Object.values(PackingCategory).reduce((acc, category) => {
    acc[category] = filteredItems.filter(item => item.category === category);
    return acc;
  }, {} as Record<PackingCategory, PackingItem[]>);

  const packingProgress = currentTrip.packingList.length > 0 
    ? (currentTrip.packingList.filter(item => item.isPacked).length / currentTrip.packingList.length) * 100 
    : 0;

  const unpackedRequiredItems = currentTrip.packingList.filter(item => item.isRequired && !item.isPacked);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Packing List - {currentTrip.name}
      </Typography>

      {/* Progress and Stats */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Packing Progress: {Math.round(packingProgress)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={packingProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {currentTrip.packingList.filter(item => item.isPacked).length} of {currentTrip.packingList.length} items packed
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              {unpackedRequiredItems.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {unpackedRequiredItems.length} required item(s) not packed
                </Alert>
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Object.values(PackingCategory).map(category => {
                  const categoryItems = currentTrip.packingList.filter(item => item.category === category);
                  const packedCount = categoryItems.filter(item => item.isPacked).length;
                  return (
                    <Chip 
                      key={category}
                      label={`${category}: ${packedCount}/${categoryItems.length}`}
                      size="small"
                      color={packedCount === categoryItems.length && categoryItems.length > 0 ? 'success' : 'default'}
                    />
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filter and Add Button */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filterCategory}
            label="Filter by Category"
            onChange={(e) => setFilterCategory(e.target.value as PackingCategory | 'all')}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {Object.values(PackingCategory).map(category => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Add Item
        </Button>
      </Box>

      {/* Packing List by Categories */}
      {Object.entries(groupedItems).map(([category, items]) => {
        if (items.length === 0) return null;
        
        return (
          <Card key={category} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
                {category.replace('_', ' ')} ({items.filter(item => item.isPacked).length}/{items.length})
              </Typography>
              <List dense>
                {items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemIcon>
                      <Checkbox
                        checked={item.isPacked}
                        onChange={() => togglePackingItem(currentTrip.id, item.id)}
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ textDecoration: item.isPacked ? 'line-through' : 'none' }}>
                            {item.name}
                          </span>
                          {item.isRequired && (
                            <Chip 
                              label="Required" 
                              size="small" 
                              color={item.isPacked ? "success" : "warning"}
                              icon={item.isPacked ? <CheckCircle /> : <Warning />}
                            />
                          )}
                        </Box>
                      }
                      secondary={item.notes}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => deletePackingItem(currentTrip.id, item.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        );
      })}

      {/* Add/Edit Item Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({...formData, category: e.target.value as PackingCategory})}
              >
                {Object.values(PackingCategory).map(category => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                checked={formData.isRequired}
                onChange={(e) => setFormData({...formData, isRequired: e.target.checked})}
              />
              <Typography>Required Item</Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Notes (optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddItem} 
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackingList;

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Pets,
  Info,
  Schedule,
  Place,
  Assignment,
  CheckCircle
} from '@mui/icons-material';
import { useHuntingTrip } from '../../context/HuntingTripContext';
import { GameType } from '../../types';

interface GameInfo {
  name: string;
  description: string;
  season: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  recommendedGear: string[];
  tips: string[];
  licenses: string[];
}

const gameDatabase: Record<GameType, GameInfo> = {
  [GameType.DEER]: {
    name: 'White-tailed Deer',
    description: 'Most popular big game animal in North America. Known for their wariness and excellent senses.',
    season: 'Fall - Early Winter (varies by state)',
    difficulty: 'Medium',
    recommendedGear: ['Rifle/Bow', 'Tree stand/Ground blind', 'Scent eliminator', 'Camouflage clothing', 'Calls'],
    tips: [
      'Hunt during dawn and dusk when deer are most active',
      'Use wind direction to your advantage',
      'Learn deer trails and feeding patterns',
      'Practice shot placement beforehand'
    ],
    licenses: ['Hunting License', 'Deer Tag', 'Hunter Safety Certificate']
  },
  [GameType.ELK]: {
    name: 'Elk',
    description: 'Large members of the deer family. Challenging hunt requiring stamina and long-range shooting skills.',
    season: 'Fall (September - November)',
    difficulty: 'Hard',
    recommendedGear: ['High-powered rifle', 'Quality optics', 'GPS device', 'Backpack for meat', 'Calls'],
    tips: [
      'Prepare for high altitude and rough terrain',
      'Learn elk bugling and calling techniques',
      'Hunt in areas with fresh sign',
      'Be ready for long-distance shots'
    ],
    licenses: ['Hunting License', 'Elk Tag (often by lottery)', 'Hunter Safety Certificate']
  },
  [GameType.BEAR]: {
    name: 'Black Bear',
    description: 'Intelligent and adaptable omnivores. Requires special safety considerations and regulations.',
    season: 'Spring/Fall (varies by state)',
    difficulty: 'Hard',
    recommendedGear: ['Large caliber rifle', 'Bear spray', 'Bear-proof food storage', 'GPS device'],
    tips: [
      'Understand bear behavior and safety protocols',
      'Use proper food storage techniques',
      'Hunt near food sources like berry patches',
      'Be prepared for bear encounters'
    ],
    licenses: ['Hunting License', 'Bear Tag', 'Hunter Safety Certificate', 'Bear Hunting Endorsement (some states)']
  },
  [GameType.DUCK]: {
    name: 'Waterfowl (Ducks)',
    description: 'Fast-flying waterfowl requiring specialized equipment and techniques.',
    season: 'Fall - Winter',
    difficulty: 'Medium',
    recommendedGear: ['Shotgun', 'Decoys', 'Duck calls', 'Waders', 'Camouflage'],
    tips: [
      'Scout water bodies beforehand',
      'Learn different duck calls',
      'Set up decoys in realistic patterns',
      'Practice shooting at moving targets'
    ],
    licenses: ['Hunting License', 'Waterfowl Stamp', 'Hunter Safety Certificate']
  },
  [GameType.TURKEY]: {
    name: 'Wild Turkey',
    description: 'Highly intelligent birds with exceptional eyesight and hearing.',
    season: 'Spring/Fall',
    difficulty: 'Medium',
    recommendedGear: ['Shotgun with turkey choke', 'Turkey calls', 'Camouflage', 'Decoys'],
    tips: [
      'Learn turkey calls and behavior',
      'Set up against a large tree for safety',
      'Use gobbler decoys carefully',
      'Be extremely still and patient'
    ],
    licenses: ['Hunting License', 'Turkey Tag', 'Hunter Safety Certificate']
  },
  [GameType.FISH]: {
    name: 'Game Fish',
    description: 'Various species of sport fish depending on location and season.',
    season: 'Year-round (varies by species)',
    difficulty: 'Easy',
    recommendedGear: ['Rod and reel', 'Tackle box', 'Bait/lures', 'Net', 'Cooler'],
    tips: [
      'Research local fishing regulations',
      'Learn about fish behavior and feeding times',
      'Use appropriate bait for target species',
      'Practice catch and release when appropriate'
    ],
    licenses: ['Fishing License', 'Species-specific stamps (some states)']
  },
  [GameType.RABBIT]: {
    name: 'Cottontail Rabbit',
    description: 'Small game animal that provides good hunting practice for beginners.',
    season: 'Fall - Winter',
    difficulty: 'Easy',
    recommendedGear: ['Small caliber rifle or shotgun', 'Orange safety gear', 'Game bag'],
    tips: [
      'Hunt in brushy areas and thickets',
      'Drive rabbits toward other hunters',
      'Be aware of other hunters in the area',
      'Clean game promptly in cold weather'
    ],
    licenses: ['Hunting License', 'Small Game License', 'Hunter Safety Certificate']
  },
  [GameType.SQUIRREL]: {
    name: 'Tree Squirrel',
    description: 'Excellent training for marksmanship and woods skills.',
    season: 'Fall - Winter',
    difficulty: 'Easy',
    recommendedGear: ['Small caliber rifle', '.22 ammunition', 'Orange safety gear'],
    tips: [
      'Hunt in hardwood forests with nut trees',
      'Move slowly and listen for movement',
      'Hunt early morning when squirrels are active',
      'Practice precise shot placement'
    ],
    licenses: ['Hunting License', 'Small Game License', 'Hunter Safety Certificate']
  },
  [GameType.PHEASANT]: {
    name: 'Ring-necked Pheasant',
    description: 'Upland game bird known for explosive flushes and challenging shots.',
    season: 'Fall',
    difficulty: 'Medium',
    recommendedGear: ['Shotgun', 'Orange safety gear', 'Hunting dog (optional)', 'Game vest'],
    tips: [
      'Hunt grasslands and agricultural edges',
      'Work into the wind when possible',
      'Use a pointing dog if available',
      'Be ready for quick shots'
    ],
    licenses: ['Hunting License', 'Upland Game License', 'Hunter Safety Certificate']
  },
  [GameType.OTHER]: {
    name: 'Other Game',
    description: 'Various other game species depending on your location and preferences.',
    season: 'Varies by species and location',
    difficulty: 'Medium',
    recommendedGear: ['Appropriate weapons', 'Species-specific gear', 'Safety equipment'],
    tips: [
      'Research local regulations thoroughly',
      'Contact local wildlife agencies',
      'Consider hiring a guide for unfamiliar species',
      'Practice with your equipment beforehand'
    ],
    licenses: ['Hunting License', 'Species-specific licenses/tags', 'Hunter Safety Certificate']
  }
};

const GameSelection: React.FC = () => {
  const { currentTrip, updateTrip } = useHuntingTrip();
  const [selectedGame, setSelectedGame] = useState<GameType | ''>('');
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [viewingGame, setViewingGame] = useState<GameType | null>(null);

  const handleGameChange = (gameType: GameType) => {
    if (!currentTrip) return;
    setSelectedGame(gameType);
    updateTrip(currentTrip.id, { gameType });
  };

  const handleViewInfo = (gameType: GameType) => {
    setViewingGame(gameType);
    setInfoDialogOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  if (!currentTrip) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Please select or create a trip to choose your target game.
        </Alert>
      </Box>
    );
  }

  const currentGameInfo = gameDatabase[currentTrip.gameType];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Game Selection - {currentTrip.name}
      </Typography>

      {/* Current Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Target: {currentGameInfo.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={currentGameInfo.difficulty}
              color={getDifficultyColor(currentGameInfo.difficulty) as any}
              size="small"
            />
            <Chip label={currentGameInfo.season} size="small" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {currentGameInfo.description}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Info />}
            onClick={() => handleViewInfo(currentTrip.gameType)}
            sx={{ mt: 2 }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>

      {/* Game Type Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Change Target Game
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Game Type</InputLabel>
            <Select
              value={currentTrip.gameType}
              label="Select Game Type"
              onChange={(e) => handleGameChange(e.target.value as GameType)}
            >
              {Object.entries(gameDatabase).map(([type, info]) => (
                <MenuItem key={type} value={type}>
                  {info.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Game Options Grid */}
      <Typography variant="h6" gutterBottom>
        Browse All Game Types
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(gameDatabase).map(([type, info]) => (
          <Grid item xs={12} sm={6} md={4} key={type}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                border: currentTrip.gameType === type ? 2 : 0,
                borderColor: 'primary.main'
              }}
              onClick={() => handleGameChange(type as GameType)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Pets sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="div">
                    {info.name}
                  </Typography>
                  {currentTrip.gameType === type && (
                    <CheckCircle sx={{ ml: 'auto', color: 'primary.main' }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={info.difficulty}
                    color={getDifficultyColor(info.difficulty) as any}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {info.description}
                </Typography>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewInfo(type as GameType);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Game Info Dialog */}
      <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} maxWidth="md" fullWidth>
        {viewingGame && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pets />
                {gameDatabase[viewingGame].name}
                <Chip 
                  label={gameDatabase[viewingGame].difficulty}
                  color={getDifficultyColor(gameDatabase[viewingGame].difficulty) as any}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {gameDatabase[viewingGame].description}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Hunting Season
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {gameDatabase[viewingGame].season}
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Required Licenses
                  </Typography>
                  <List dense>
                    {gameDatabase[viewingGame].licenses.map((license, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckCircle fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={license} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Recommended Gear
                  </Typography>
                  <List dense>
                    {gameDatabase[viewingGame].recommendedGear.map((gear, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckCircle fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary={gear} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Hunting Tips
                  </Typography>
                  <List>
                    {gameDatabase[viewingGame].tips.map((tip, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={tip}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
              {viewingGame !== currentTrip.gameType && (
                <Button 
                  onClick={() => {
                    handleGameChange(viewingGame);
                    setInfoDialogOpen(false);
                  }}
                  variant="contained"
                >
                  Select This Game
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default GameSelection;

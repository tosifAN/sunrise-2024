import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import Task from '@/model/Task';

interface TaskCardProps {
  task: Task;
  onDone: () => void;
  isDisabled: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDone, isDisabled }) => {
  const buttonDisabled = isDisabled || task.stage !== 'In Progress';

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        marginBottom: 2, 
        border: '1px solid #d0d0d0', 
        width: 170,
        height: 170
      }}
    >
      <CardContent sx={{ position: 'relative', padding: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: task.stage === 'Completed' ? 'center' : 'space-between', 
          alignItems: 'center',
          padding: '2px 4px',
          borderRadius: '4px',
          fontWeight: 'bold',
          textAlign: task.stage === 'Completed' ? 'center' : 'inherit',
          width: task.stage === 'Completed' ? '100%' : 'auto'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: task.stage === 'Completed' ? 'center' : 'inherit',
              width: task.stage === 'Completed' ? '100%' : 'auto'
            }}
          >
            Task {task.id}
          </Typography>
          {task.stage !== 'Completed' && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onDone} 
              sx={{ fontSize: '0.75rem' }} 
              disabled={buttonDisabled}
            >
              Done
            </Button>
          )}
        </Box>
        <Typography variant="h6" component="div" sx={{ fontSize: '1rem', marginTop: 1 }}>
          {task.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', marginTop: 1 }}>
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

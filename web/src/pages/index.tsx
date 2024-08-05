import React, { useState } from 'react';
import { Container, Grid, Typography, Box, Badge, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Brightness7, Brightness4 } from '@mui/icons-material';
import TaskCard from '@/components/TaskCard';
import Task from '@/model/Task';
import { initialTasks } from '@/utils/TaskList';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({ id: 11, stage: 'To-Do' });


  const stageBadgeColors: { [key: string]: { backgroundColor: string, color: string } } = {
    'To-Do': { backgroundColor: 'darkgrey', color: 'grey' },
    'In Progress': { backgroundColor: 'lightblue', color: 'darkblue' },
    'Completed': { backgroundColor: 'green', color: 'white' },
  };

  const moveTaskToNextStage = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        task.stage = 'Completed';
      }
      return task;
    }));

    const currentTask = tasks.find(task => task.id === taskId);
    if (currentTask) {
      const nextTaskInSameGroup = tasks.find(task => task.group === currentTask.group && task.stage === 'To-Do');
      if (nextTaskInSameGroup) {
        setTasks(tasks.map(task => {
          if (task.id === nextTaskInSameGroup.id) {
            task.stage = 'In Progress';
          }
          return task;
        }));
      } else {
        const nextGroupTask = tasks.find(task => task.group === currentTask.group + 1 && task.stage === 'To-Do');
        if (nextGroupTask) {
          setTasks(tasks.map(task => {
            if (task.id === nextGroupTask.id) {
              task.stage = 'In Progress';
            }
            return task;
          }));
        }
      }
    }
  };

  const isButtonDisabled = (group: number) => {
    if (group === 1) return false;

    const tasksInCurrentAndPreviousGroups = tasks.filter(task => task.group < group);
    return tasksInCurrentAndPreviousGroups.some(task => task.stage !== 'Completed');
  };

  const renderTasks = (stage: string) => {
    const tasksByGroup = tasks.filter(task => task.stage === stage)
                              .reduce((acc, task) => {
                                (acc[task.group] = acc[task.group] || []).push(task);
                                return acc;
                              }, {} as { [key: number]: Task[] });

    return Object.entries(tasksByGroup).map(([group, groupTasks], index) => (
      <Grid container spacing={2} key={index} direction="row-reverse">
        <Grid item xs={6}>
          {groupTasks.filter(task => task.id % 2 === 0).map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDone={() => moveTaskToNextStage(task.id)} 
              isDisabled={isButtonDisabled(Number(group))}
            />
          ))}
        </Grid>
        <Grid item xs={6}>
          {groupTasks.filter(task => task.id % 2 !== 0).map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDone={() => moveTaskToNextStage(task.id)} 
              isDisabled={isButtonDisabled(Number(group))}
            />
          ))}
        </Grid>
      </Grid>
    ));
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleAddTask = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddNewTask = () => {
    setTasks([...tasks, new Task(newTask.id as number, newTask.title as string, newTask.description as string, newTask.persona as string, newTask.group as number, newTask.stage as string)]);
    setNewTask({ id: newTask.id! + 1, stage: 'To-Do' });
    setIsDialogOpen(false);
  };

  const themeStyles = {
    backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
    color: isDarkMode ? '#fff' : '#000',
  };
  return (
    <Container 
      sx={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column', 
        p: 2 ,
        ...themeStyles
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ borderBottom: '2px solid #d0d0d0', paddingBottom: 2 }}>
        Task Board
      </Typography>
      <IconButton 
        onClick={toggleTheme} 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 170, 
          zIndex: 1000, 
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }}
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddTask} 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 50,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }}
      >
        Add Task
      </Button>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details for the new task.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="persona"
            label="Persona"
            type="text"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="group"
            label="Group"
            type="number"
            fullWidth
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddNewTask}>Add</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {['To-Do', 'In Progress', 'Completed'].map(stage => {
          const taskCount = tasks.filter(task => task.stage === stage).length;
          return (
            <Grid item xs={4} key={stage}>
              <Box sx={{ 
                backgroundColor: isDarkMode ? '#555' : '#f9f9f9',
                color: isDarkMode ? '#fff' : '#000',
                padding: 2,
                borderRadius: 1,
                height: '100%' 
              }}>
                <Typography variant="h6" gutterBottom>
                  {stage} 
                  <Badge 
                    badgeContent={taskCount === 0 ? '0' : taskCount} 
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        backgroundColor: stageBadgeColors[stage].backgroundColor, 
                        color: stageBadgeColors[stage].color 
                      },
                      marginLeft: 2
                    }}
                  />
                </Typography>
                {renderTasks(stage)}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Home;
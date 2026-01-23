import task from '../models/task.js';
import {io} from '../server.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status, Deadline } = req.body;
    const newTask = new task({
      title,
      description,
      status,
      Deadline,
      createdBy: req.user._id,
      assignedTo: req.user._id,
    });

    io.emit('taskCreated', newTask);

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};  

export const getTasks = async (req, res) => {
  try {
    const tasks = await task.find().populate('assignedTo', 'fullName email').populate('createdBy', 'fullName email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }     
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  } 
};

export const deleteTask = async (req, res) => { 
  try {
    const { id } = req.params;
    const deletedTask = await task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    io.emit('taskDeleted', id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundTask = await task.findById(id).populate('assignedTo', 'fullName email').populate('createdBy', 'fullName email'); 
    if (!foundTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(foundTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await task.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    io.emit('taskStatusUpdated', updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAdminTasks = async (req, res) => {
  try {
    const tasks = await task.find().populate('assignedTo', 'fullName email').populate('createdBy', 'fullName email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminDeleteTask = async (req, res) => {
  try {
    const { id } = req.params;  
    const deletedTask = await task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }   
    io.emit('taskDeleted', id);

    res.status(200).json({ message: 'Task deleted successfully by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

export const markTaskAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await task.findByIdAndUpdate(id, { status: 'completed' }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }   
    io.emit('taskCompleted', updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

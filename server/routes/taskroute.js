import express from 'express';
import auth from '../middlewares/auth.js'; 
import isAdmin from '../middlewares/isAdmin.js';
import { getTasks, createTask, getTaskById, updateTask, deleteTask, getAllAdminTasks, adminDeleteTask} from '../controllers/taskcontroller.js';

const router = express.Router();

router.get('/tasks', auth, getTasks);
router.post('/tasks', auth, createTask);
router.get('/tasks/:id', auth, getTaskById);
router.put('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

//admin routes
router.get('/admin/tasks', auth, isAdmin, getAllAdminTasks);
router.delete('/admin/tasks/:id', auth, isAdmin, adminDeleteTask);

export default router;  



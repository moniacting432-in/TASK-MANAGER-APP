'use client';
import React, { useEffect, useState } from 'react';
import TaskList from './components/TaskList';
import TaskModel from './components/TaskModel';
import TaskView from './components/TaskView';
import TaskForm from './components/TaskForm';
import { useAuth } from './lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function Homepage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', status: '', description: '' });

  // ------------------ Fetch tasks ------------------
  useEffect(() => {
    if (!user) return; // wait for user

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?userId=${user.uid}`);

        if (!res.ok) {
          console.error('Failed to fetch tasks, status:', res.status);
          setTasks([]);
          return;
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [user]);

  // ------------------ Redirect if no user ------------------
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  // ------------------ Add Task ------------------
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.uid }),
      });

      if (!res.ok) {
        console.error('Failed to add task, status:', res.status);
        return;
      }

      const text = await res.text();
      const newTask = text ? JSON.parse(text) : null;
      if (newTask) setTasks([...tasks, newTask]);

      setFormData({ title: '', status: 'Pending', description: '' });
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // ------------------ Delete Task ------------------
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        console.error('Failed to delete task, status:', res.status);
        return;
      }

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // ------------------ Update Task ------------------
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tasks/${isEditing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.error('Failed to update task, status:', res.status);
        return;
      }

      const text = await res.text();
      const updatedTask = text ? JSON.parse(text) : null;

      if (updatedTask) {
        setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
        setIsEditing(null);
        setFormData({ title: '', status: '', description: '' });
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // ------------------ Render ------------------
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Tasks</h1>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => setIsAdding(true)}
          >
            Add Task
          </button>

          {user && (
            <div className="flex items-center gap-4">
              <img
                src={user.photoURL || 'https://via.placeholder.com/40'}
                alt="User"
                className="w-8 h-8 rounded-full border"
              />
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onView={setSelectedTask}
          onEdit={(task) => {
            setIsEditing(task);
            setFormData(task);
          }}
          onDelete={handleDelete}
        />

        {/* Task View Modal */}
        {selectedTask && (
          <TaskModel onClose={() => setSelectedTask(null)}>
            <TaskView task={selectedTask} />
          </TaskModel>
        )}

        {/* Add Task Modal */}
        {isAdding && (
          <TaskModel onClose={() => setIsAdding(false)}>
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <TaskForm
              onSubmit={handleAddTask}
              setFormData={setFormData}
              formData={formData}
              buttonLabel="Add Task"
              onCancel={() => setIsAdding(false)}
            />
          </TaskModel>
        )}

        {/* Edit Task Modal */}
        {isEditing && (
          <TaskModel onClose={() => setIsEditing(null)}>
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <TaskForm
              onSubmit={handleUpdateTask}
              setFormData={setFormData}
              formData={formData}
              buttonLabel="Update Task"
              onCancel={() => setIsEditing(null)}
            />
          </TaskModel>
        )}
      </div>
    </div>
  );
}

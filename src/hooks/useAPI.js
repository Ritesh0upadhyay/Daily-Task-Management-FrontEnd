import { useState, useEffect, useCallback } from "react";
import { taskAPI } from "../services/apiService.js";

export const useAPI = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskAPI.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to fetch tasks");
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new task
  const addTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      // Map frontend data format to backend format
      const backendData = {
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority === "High" ? 3 : taskData.priority === "Medium" ? 2 : 1,
        status: mapStatusToBackend(taskData.status),
        due_date: taskData.due_date || null,
      };

      const newTask = await taskAPI.createTask(backendData);
      setTasks([newTask, ...tasks]);
      return newTask;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to add task";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  // Delete a task
  const deleteTask = useCallback(
    async (taskId) => {
      setLoading(true);
      setError(null);
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || "Failed to delete task";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [tasks]
  );

  // Complete a task (update status to "completed")
  const completeTask = useCallback(
    async (taskId) => {
      setLoading(true);
      setError(null);
      try {
        const updatedTask = await taskAPI.updateTask(taskId, {
          status: "completed",
        });
        setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || "Failed to complete task";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [tasks]
  );

  // Update a task
  const updateTask = useCallback(
    async (taskId, taskData) => {
      setLoading(true);
      setError(null);
      try {
        // Map frontend data format to backend format
        const backendData = {
          title: taskData.title,
          description: taskData.description || null,
          priority:
            taskData.priority === "High"
              ? 3
              : taskData.priority === "Medium"
              ? 2
              : 1,
          status: mapStatusToBackend(taskData.status),
          due_date: taskData.due_date || null,
        };

        const updatedTask = await taskAPI.updateTask(taskId, backendData);
        setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
        return updatedTask;
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || "Failed to update task";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [tasks]
  );

  // Helper function to map status values
  const mapStatusToBackend = (status) => {
    switch (status) {
      case "Complete":
        return "completed";
      case "In Progress":
        return "in_progress";
      case "Incomplete":
        return "pending";
      default:
        return "pending";
    }
  };

  // Helper function to map status from backend
  const mapStatusFromBackend = (status) => {
    switch (status) {
      case "completed":
        return "Complete";
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Incomplete";
      default:
        return "Incomplete";
    }
  };

  // Helper function to map priority from backend
  const mapPriorityFromBackend = (priority) => {
    if (priority >= 3) return "High";
    if (priority === 2) return "Medium";
    return "Low";
  };

  // Helper function to convert backend task to frontend format
  const convertTaskFromBackend = (backendTask) => {
    return {
      id: backendTask.id,
      title: backendTask.title,
      description: backendTask.description || "",
      priority: mapPriorityFromBackend(backendTask.priority),
      status: mapStatusFromBackend(backendTask.status),
      createdAt: backendTask.created_at,
      completedAt: backendTask.updated_at,
      dueDate: backendTask.due_date,
    };
  };

  return {
    tasks: tasks.map(convertTaskFromBackend),
    loading,
    error,
    fetchTasks,
    addTask,
    deleteTask,
    completeTask,
    updateTask,
  };
};

export default useAPI;

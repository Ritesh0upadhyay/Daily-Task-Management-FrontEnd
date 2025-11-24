// Defines your main React Component. Every React app starts from here.
import { useState, useEffect } from "react";
import { notificationService } from "./services/notificationService";
import { Toaster, toast } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useParams,
} from "react-router-dom";
import useAPI from "./hooks/useAPI";
import CombinedDashboard from "./pages/CombinedDashboard";
import { sendDailySummary } from "./services/emailService";
import { sendTestEmail } from "./services/emailService";
import TaskForm from "./components/tasks/TaskForm";
import Modal from "./components/common/Modal";

function App() {
  // Use API hook to manage tasks from backend
  const { tasks, loading, error, fetchTasks, addTask, deleteTask, completeTask, updateTask } = useAPI();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleEditTask = async (updatedTask) => {
    try {
      await updateTask(updatedTask.id, updatedTask);
      toast.success("Task updated successfully!");
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  useEffect(() => {
    notificationService.init();
  }, []);

  useEffect(() => {
    // Helper to calculate time till 8:30 PM today or next day if past 8:30 PM
    function getMSUntilTarget(hour, minute) {
      const now = new Date();
      const target = new Date();
      target.setHours(hour, minute, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      return target.getTime() - now.getTime();
    }

    // This callback will be called at the scheduled time
    async function sendSummaryAtNight() {
      // Only send if there were tasks today
      const todayStr = new Date().toISOString().split("T")[0];
      const todaysTasks = tasks.filter((task) =>
        task.createdAt.startsWith(todayStr)
      );
      if (todaysTasks.length === 0) return;

      const completed = todaysTasks.filter((t) => t.status === "Complete");
      const pending = todaysTasks.filter((t) => t.status !== "Complete");

      const message = `
Daily Productivity Tracker Summary

Date: ${todayStr}
Total tasks created today: ${todaysTasks.length}
Completed tasks: ${completed.length}
Pending tasks: ${pending.length}

Completed Tasks:
${completed.length ? completed.map((t) => `- ${t.title}`).join("\n") : "None"}

Pending Tasks:
${pending.length ? pending.map((t) => `- ${t.title}`).join("\n") : "None"}
`;

      // Replace with manager's email:
      const toEmail = "ashokmuwal111@gmail.com";

      const success = await sendDailySummary({ toEmail, message });
      if (success) {
        toast.success("Daily summary email sent successfully!");
      } else {
        toast.error("Failed to send daily summary email.");
      }
    }

    // Set up timer
    const msUntil830 = getMSUntilTarget(20, 30); // 8:30 PM
    const timerId = setTimeout(() => {
      sendSummaryAtNight();
      // Set up daily repetition
      setInterval(sendSummaryAtNight, 24 * 60 * 60 * 1000);
    }, msUntil830);

    // Cleanup if component unmounts
    return () => clearTimeout(timerId);
  }, [tasks]);

  // Export tasks as JSON file
  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tasks-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import tasks from JSON file
  const importTasks = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (!Array.isArray(importedTasks)) {
          throw new Error("Invalid file format");
        }

        // Import each task
        for (const task of importedTasks) {
          try {
            await addTask({
              title: task.title,
              description: task.description || "",
              priority: task.priority || "Medium",
              status: task.status || "Incomplete",
            });
          } catch (err) {
            console.error(`Failed to import task: ${task.title}`, err);
          }
        }
        toast.success(`Imported ${importedTasks.length} tasks!`);
      } catch (error) {
        toast.error("Error importing tasks. Please check file format.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
  };

  // Function to add a new task
  const handleAddTask = async (newTask) => {
    try {
      await addTask(newTask);
      toast.success("Task added successfully!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  // Function to delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Function to complete a task
  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      toast.success("Task completed!");
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Navbar */}
          <nav className="bg-white shadow p-4 flex justify-center gap-8 font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-700 border-b-4 border-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }
              end
            >
              Dashboard
            </NavLink>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <CombinedDashboard
                  tasks={tasks}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                  onAdd={() => setIsModalOpen(true)}
                  onEdit={(task) => setEditingTask(task)}
                />
              }
            />
          </Routes>

          {/* Modal for adding tasks */}
          <Modal
            isOpen={isModalOpen || editingTask !== null}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(null);
            }}
            title={editingTask ? "Edit Task" : "Create New Task"}
          >
            <TaskForm
              initialData={editingTask}
              onSubmit={editingTask ? handleEditTask : handleAddTask}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingTask(null);
              }}
            />
          </Modal>
        </div>
      </Router>
    </>
  );
}

export default App;

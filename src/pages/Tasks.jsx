import TaskCard from "../components/tasks/TaskCard";
import FilterSortPanel from "../components/FilterSortPanel";
import { useState, useMemo } from "react";

function Tasks({ tasks, onComplete, onDelete, onAdd, onEdit }) {
  // State for filters and sorting
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortField, setSortField] = useState("createdAt");
  // Filter and sort tasks (memoized for performance)
  const filteredSortedTasks = useMemo(() => {
    // Recompute only when tasks or filters/sort change
    let filtered = tasks;

    // Filter by Priority
    if (filterPriority !== "All") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    // Filter by Status
    if (filterStatus !== "All") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Sort filtered array
    switch (sortField) {
      case "createdAt":
        filtered = filtered
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;

      case "createdAtOldest":
        filtered = filtered
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;

      case "titleAsc":
        filtered = filtered
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "titleDesc":
        filtered = filtered
          .slice()
          .sort((a, b) => b.title.localeCompare(a.title));
        break;

      default:
        break;
    }

    return filtered;
  }, [tasks, filterPriority, filterStatus, sortField]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800">All Tasks</h1>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Task
        </button>
      </div>

      {/* Filter and Sort Panel */}
      <FilterSortPanel
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortField={sortField}
        setSortField={setSortField}
      />

      {filteredSortedTasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-16">
          No tasks yet. Create some tasks to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;

import { useState, useMemo } from "react";
import TaskCard from "../components/tasks/TaskCard";
import FilterSortPanel from "../components/FilterSortPanel";

function CombinedDashboard({ tasks, onComplete, onDelete, onAdd, onEdit }) {
  // Calculate KPIs
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Complete").length;
  const completionPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;

  // State for filters and sorting
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDueDate, setFilterDueDate] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(0);
  const TASKS_PER_PAGE = 6;

  // Filter and sort tasks
  const filteredSortedTasks = useMemo(() => {
    let filtered = tasks;

    if (filterPriority !== "All") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Apply due date filter
    if (filterDueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.createdAt);
        taskDate.setHours(0, 0, 0, 0);
        
        switch (filterDueDate) {
          case "today":
            return taskDate.getTime() === today.getTime();
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return taskDate >= weekAgo && taskDate <= today;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setDate(monthAgo.getDate() - 30);
            return taskDate >= monthAgo && taskDate <= today;
          case "overdue":
            return taskDate < today && task.status !== "Complete";
          default:
            return true;
        }
      });
    }

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
  }, [tasks, filterPriority, filterStatus, filterDueDate, sortField]);

  // Filter for pending/incomplete tasks
  const pendingTasks = useMemo(() => {
    return filteredSortedTasks.filter(
      (task) => task.status === "Incomplete" || task.status === "In Progress"
    );
  }, [filteredSortedTasks]);

  // Calculate pagination
  const totalPages = Math.ceil(pendingTasks.length / TASKS_PER_PAGE);
  const startIndex = currentPage * TASKS_PER_PAGE;
  const endIndex = startIndex + TASKS_PER_PAGE;
  const paginatedTasks = pendingTasks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (setter) => (value) => {
    setCurrentPage(0);
    setter(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* KPIs Section - Full Width at Top */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Productivity Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Tasks */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Total Tasks
                  </p>
                  <p className="mt-3 text-4xl font-bold text-blue-900">{totalTasks}</p>
                </div>
                <div className="bg-blue-500 rounded-full p-3 opacity-20">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2h10a1 1 0 000-2 2 2 0 00-2 2v10a2 2 0 002 2 1 1 0 000 2h-2a1 1 0 100 2h2a2 2 0 002-2V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
                    Completed
                  </p>
                  <p className="mt-3 text-4xl font-bold text-green-900">{completedTasks}</p>
                </div>
                <div className="bg-green-500 rounded-full p-3 opacity-20">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                    In Progress
                  </p>
                  <p className="mt-3 text-4xl font-bold text-yellow-900">{inProgressTasks}</p>
                </div>
                <div className="bg-yellow-500 rounded-full p-3 opacity-20">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-.707.707a1 1 0 101.414 1.414L9 9.414V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completion Percentage */}
            <div className={`bg-gradient-to-br ${
              completionPercent >= 75
                ? "from-purple-50 to-purple-100 border-purple-200"
                : completionPercent >= 40
                ? "from-orange-50 to-orange-100 border-orange-200"
                : "from-red-50 to-red-100 border-red-200"
            } rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Completion Rate
                  </p>
                  <p className={`mt-3 text-4xl font-bold ${
                    completionPercent >= 75
                      ? "text-purple-900"
                      : completionPercent >= 40
                      ? "text-orange-900"
                      : "text-red-900"
                  }`}>
                    {completionPercent}%
                  </p>
                </div>
                <div className={`${
                  completionPercent >= 75
                    ? "bg-purple-500"
                    : completionPercent >= 40
                    ? "bg-orange-500"
                    : "bg-red-500"
                } rounded-full p-3 opacity-20`}>
                  <svg className={`w-8 h-8 ${
                    completionPercent >= 75
                      ? "text-purple-600"
                      : completionPercent >= 40
                      ? "text-orange-600"
                      : "text-red-600"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h.01a1 1 0 110 2H12zm-2 2a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 2a1 1 0 100 2h.01a1 1 0 100-2H6zm8 4H6a3 3 0 01-3-3V7a3 3 0 013-3h8a3 3 0 013 3v6a3 3 0 01-3 3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Section - Full Width */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <FilterSortPanel
            filterPriority={filterPriority}
            setFilterPriority={handleFilterChange(setFilterPriority)}
            filterStatus={filterStatus}
            setFilterStatus={handleFilterChange(setFilterStatus)}
            filterDueDate={filterDueDate}
            setFilterDueDate={handleFilterChange(setFilterDueDate)}
            sortField={sortField}
            setSortField={handleFilterChange(setSortField)}
          />
        </div>
      </div>

      {/* Main Content Area - Left Tasks (60%) and Right Empty Space */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6 h-full">
          {/* Left Section - Tasks (60%) */}
          <div className="flex-1 min-w-0">
            {/* Add Task Button and Title */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pending Tasks</h2>
              <button
                onClick={onAdd}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold flex items-center gap-2 shadow-sm hover:shadow-md"
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
                Add New Task
              </button>
            </div>

            {/* Tasks Grid */}
            {paginatedTasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No pending tasks</p>
                <p className="text-gray-400 text-sm mt-1">Great job! All tasks are complete</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {paginatedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={onComplete}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-700">
                      Showing <span className="font-bold">{startIndex + 1}-{Math.min(endIndex, pendingTasks.length)}</span> of <span className="font-bold text-blue-600">{pendingTasks.length}</span> pending tasks
                    </div>
                    <div className="flex gap-6 items-center">
                      <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className={`text-sm font-medium transition-colors ${
                          currentPage === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800 hover:underline"
                        }`}
                      >
                        ← Previous
                      </button>
                      <div className="flex items-center gap-2 px-3">
                        <span className="text-sm font-semibold text-gray-600">
                          Page {currentPage + 1} of {totalPages}
                        </span>
                      </div>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className={`text-sm font-medium transition-colors ${
                          currentPage >= totalPages - 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800 hover:underline"
                        }`}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Section - Reserved Space (13cm x 8cm) */}
          <div className="hidden lg:block" style={{ width: "320px", height: "304px" }}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-gray-300 p-6 h-full flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-sm font-semibold text-gray-400">Reserved Space</p>
              <p className="text-xs text-gray-300 mt-1">For future features</p>
              <p className="text-xs text-gray-400 mt-3 font-mono">13cm × 8cm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CombinedDashboard;

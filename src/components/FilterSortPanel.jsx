import React from "react";

function FilterSortPanel({
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  sortField,
  setSortField,
  filterDueDate,
  setFilterDueDate,
}) {
  return (
    <div className="w-full">
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Filters & Sorting</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Priority Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="priority"
              className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14z" />
                <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
              Priority
            </label>
            <select
              id="priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors text-sm"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="status"
              className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Incomplete">📋 Incomplete</option>
              <option value="In Progress">⏳ In Progress</option>
              <option value="Complete">✅ Complete</option>
            </select>
          </div>

          {/* Due Date Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="dueDate"
              className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6z" />
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0h12v12H4V5z" clipRule="evenodd" />
              </svg>
              Time Frame
            </label>
            <select
              id="dueDate"
              value={filterDueDate || "All"}
              onChange={(e) => setFilterDueDate(e.target.value === "All" ? null : e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors text-sm"
            >
              <option value="All">All Time</option>
              <option value="today">📅 Today</option>
              <option value="week">📆 This Week</option>
              <option value="month">📊 This Month</option>
              <option value="overdue">⚠️ Overdue</option>
            </select>
          </div>

          {/* Sort Field */}
          <div className="flex flex-col">
            <label
              htmlFor="sort"
              className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L13 10.414V16z" />
              </svg>
              Sort By
            </label>
            <select
              id="sort"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors text-sm"
            >
              <option value="createdAt">🆕 Newest First</option>
              <option value="createdAtOldest">🕐 Oldest First</option>
              <option value="titleAsc">🔤 Title (A-Z)</option>
              <option value="titleDesc">🔤 Title (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSortPanel;

import React from "react";

function FilterSortPanel({
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  sortField,
  setSortField,
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-md shadow-md max-w-6xl mx-auto mb-8">
      {/* Priority Filter */}
      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter by Priority
        </label>
        <select
          id="priority"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter by Status
        </label>
        <select
          id="status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Incomplete">Incomplete</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>
      </div>

      {/* Sort Field */}
      <div>
        <label
          htmlFor="sort"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sort by
        </label>
        <select
          id="sort"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt">Creation Date (Newest)</option>
          <option value="createdAtOldest">Creation Date (Oldest)</option>
          <option value="titleAsc">Title (A-Z)</option>
          <option value="titleDesc">Title (Z-A)</option>
        </select>
      </div>
    </div>
  );
}

export default FilterSortPanel;

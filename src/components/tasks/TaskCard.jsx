// Defines a React component named TaskCard - { task } - Destructuring props - This component receives a task object as input
// Props are like function parameters - data passed from parent component to child
function TaskCard({ task, onComplete, onDelete, onEdit }) {
  // Why create a handler?
  // onClick needs a function
  // We want to call onComplete with task.id
  // Can't write onClick={onComplete(task.id)} (would call immediately)
  // Wrap in arrow function: onClick={() => onComplete(task.id)} OR create named handler
  const handleComplete = () => {
    onComplete(task.id);
  };
  const handleDelete = () => {
    if (window.confirm(`Delete task: ${task.title}?`)) {
      // window.confirm() shows browser confirmation dialog
      onDelete(task.id);
    }
  };
  return (
    <div className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 min-h-48 flex flex-col">
      {/* Top-right icons: Edit (pen) and Delete (trash) */}
      <div className="absolute top-3 right-3 flex items-center gap-0">
        <button
          aria-label="Edit task"
          onClick={() => onEdit(task)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {/* Pencil icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          aria-label="Delete task"
          onClick={handleDelete}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {/* Trash icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
          </svg>
        </button>
      </div>

      {/* Task Title */}
      <h3
        className={`text-xl font-semibold mb-4 truncate pr-8 ${
          task.status === "Complete"
            ? "line-through text-gray-500"
            : "text-gray-800"
        }`}
      >
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
      )}

      {/* Spacer to push button to bottom */}
      <div className="flex-grow"></div>

      {/* Priority and Status Badges */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {/* Priority Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
          ${task.priority === "High" ? "bg-red-100 text-red-700" : ""}
          ${task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : ""}
          ${task.priority === "Low" ? "bg-green-100 text-green-700" : ""}`}
        >
          {task.priority}
        </span>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
          ${task.status === "Complete" ? "bg-green-100 text-green-700" : ""}
          ${task.status === "In Progress" ? "bg-blue-100 text-blue-700" : ""}
          ${task.status === "Incomplete" ? "bg-gray-100 text-gray-700" : ""}`}
        >
          {task.status}
        </span>
      </div>

      {/* Action: full-width outlined Completed button when not complete */}
      <div className="mt-2">
        {task.status !== "Complete" ? (
          <button
            onClick={handleComplete}
            className="w-full border border-green-500 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors text-sm font-medium"
          >
            Completed
          </button>
        ) : (
          <div className="w-full text-center text-green-600 text-sm font-medium px-4 py-2">
            Completed
          </div>
        )}
      </div>
    </div>
  );
}
export default TaskCard;

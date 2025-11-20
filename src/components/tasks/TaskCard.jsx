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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Task Title */}
      <h3
        className={`text-xl font-semibold mb-2 ${
          task.status === "Complete"
            ? "line-through text-gray-500"
            : "text-gray-800"
        }`}
      >
        {task.title}
      </h3>
      {/* JavaScript expression in JSX - displays the task's title from props Curly braces {} in JSX mean: Execute this as JavaScript, not text. */}
      {/* Task Description */}
      {task.description && (
        // Conditional rendering - only show description if it exists
        <p className="text-gray-600 text-sm mb-4">{task.description}</p>
      )}
      {/* Priority and Status Badges */}
      <div className="flex gap-2 mb-4">
        {/* Priority Badge */}
        <span
          // Template literal with backticks ` `: Allows multi-line strings. Allows ${ } for JavaScript expressions inside strings
          className={`
          px-3 py-1 rounded-full text-xs font-semibold
        //   Dynamic classes based on task priority
          ${task.priority === "High" ? "bg-red-100 text-red-700" : ""}
          ${task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : ""}
          ${task.priority === "Low" ? "bg-green-100 text-green-700" : ""}
        `}
        >
          {task.priority}
        </span>

        {/* Status Badge */}
        <span
          className={`
          px-3 py-1 rounded-full text-xs font-semibold
        //   Dynamic classes based on task status
          ${task.status === "Complete" ? "bg-green-100 text-green-700" : ""}
          ${task.status === "In Progress" ? "bg-blue-100 text-blue-700" : ""}
          ${task.status === "Incomplete" ? "bg-gray-100 text-gray-700" : ""}
        `}
        >
          {task.status}
        </span>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-2">
        {task.status !== "Complete" && (
          <button
            onClick={handleComplete}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
          >
            Complete
          </button>
        )}
        <button
          onClick={() => onEdit(task)} // Trigger edit with the task data
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
export default TaskCard;

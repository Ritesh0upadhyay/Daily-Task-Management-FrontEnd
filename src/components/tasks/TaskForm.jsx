import { useEffect, useState } from "react"; // Import useState hook from React to manage form data and errors

function TaskForm({ onSubmit, onCancel, initialData }) {
  // Props: onSubmit (function to call on form submit), onCancel (function to call on cancel)
  // Form state -- manage input values
  const [formData, setFormData] = useState({
    // Initial form data
    title: "",
    description: "",
    priority: "Medium",
    status: "Incomplete",
  });

  // Error state -- stores validation errors
  const [errors, setErrors] = useState({}); // Initially no errors

  // If initialData is provided (for editing), populate form with it
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "Medium",
        status: initialData.status || "Incomplete",
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    // e: event object from input change
    const { name, value } = e.target; // Destructure name and value from event target (input field)
    setFormData((prev) => ({
      // Update formData state
      ...prev, // Spread existing formData properties
      [name]: value, // Update the property matching input's name with new value
    }));

    if (errors[name]) {
      // Clear error for this field if it exists
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form data
  const validate = () => {
    const newErrors = {}; // Object to hold validation errors

    if (!formData.title.trim()) {
      // Title is required
      newErrors.title = "Task Title is required";
    } else if (formData.title.length > 100) {
      // Max length 100 chars
      newErrors.title = "Task Title cannot exceed 100 characters";
    }

    // Description max length 500 chars
    if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    return newErrors; // Return errors object
  };

  // Handle form submission
  const handleSubmit = (e) => {
    // e: event object from form submission
    e.preventDefault(); // Prevent default form submission behavior
    const validationErrors = validate(); // Validate form data
    if (Object.keys(validationErrors).length > 0) {
      // If there are validation errors
      setErrors(validationErrors); // Update errors state
      return; // Stop submission
    }

    const submission = {
      ...initialData, // Spread initialData to retain existing properties (like id) if editing
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      completedAt:
        formData.status === "Complete" && !initialData?.completedAt
          ? new Date().toISOString()
          : initialData?.completedAt || null,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      id: initialData?.id || Date.now().toString(),
    };

    onSubmit(submission); // Call onSubmit prop with form data

    setFormData({
      // Reset form data
      title: "",
      description: "",
      priority: "Medium",
      status: "Incomplete",
    });

    setErrors({}); // Clear errors
  };

  return (
    // When form submits, call handleSubmit
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Task Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Task Title<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.title.length}/100 characters
        </p>
      </div>

      {/* Task Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add more details..."
          rows="4"
          // `` provides template literals for multi-line strings and JS expressions
          // Dynamic class based on error presence
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Priority Select */}
      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Status Select */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Incomplete">Incomplete</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>
      </div>

      {/* Form Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {initialData ? "Update Task" : "Add Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;

import { TASK_STATUSES } from "../utils/constants";

const TaskCard = ({ task, canUpdateStatus, onUpdateStatus }) => {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{task.description || "No description."}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {task.priority}
        </span>
      </div>
      <div className="mt-3 text-sm text-slate-600">
        <p>Assigned: {task.assignedTo?.name}</p>
        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="mt-3">
        {canUpdateStatus ? (
          <select
            value={task.status}
            onChange={(e) => onUpdateStatus(task._id, e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {task.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

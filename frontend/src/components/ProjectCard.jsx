const ProjectCard = ({ project, children }) => {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm border border-slate-200">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
        <p className="text-sm text-slate-600">{project.description || "No description provided."}</p>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Admin: {project.admin?.name} | Members: {project.members?.length || 0}
      </p>
      {children}
    </div>
  );
};

export default ProjectCard;

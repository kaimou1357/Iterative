import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const ProjectsModal = ({ isOpen, onClose, onSelectProject, onDeleteProject }) => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    // Fetch projects when the modal is opened
    if (isOpen) {
      axios.get(`${API_BASE_URL}/get-projects`).then((response) => {
        setProjects(response.data.projects);
      });
    }
  }, [isOpen]);

  const handleOpenProject = (project) => {
    onSelectProject(project);
    onClose();
  };

  const handleNewProject = () => {
    axios
      .post(`${API_BASE_URL}/create-project`, { name: newProjectName })
      .then((response) => {
        // The response now includes the full project details
        const newProject = {
            id: response.data.project.id,
            name: response.data.project.name,
            users: response.data.project.users,
            projectStates: response.data.project.projectStates,
            cssFramework: response.data.project.cssFramework
        };
        // Refresh the projects list
        setProjects([...projects, newProject]);
        setNewProjectName('');
      });
  };

  const handleDeleteProject = (project) => {
    axios
      .delete(`${API_BASE_URL}/delete-project`, { data: { project_id: project.id } })
      .then(() => {
        // Remove the deleted project from the local state
        setProjects(projects.filter((proj) => proj.id !== project.id));
        onDeleteProject(project);
      });
  };

  return (
    <div className={`modal fade ${isOpen ? 'show d-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Your Projects</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ul className="list-group">
              {projects.map((project) => (
                <li key={project.id} className="list-group-item d-flex justify-content-between">
                  {project.name}
                  <div>
                    <button className="btn btn-primary me-2" onClick={() => handleOpenProject(project)}>Open</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteProject(project)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="New project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <button className="btn btn-secondary" onClick={handleNewProject}>New Project</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsModal;

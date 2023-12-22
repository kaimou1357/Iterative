'use client'
 
import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LiveCodeEditor from './LiveCodeEditor';
import ProjectsModal from './ProjectsModal';
import { API_BASE_URL } from './config';
import ReactMarkdown from 'react-markdown';
import DeploymentModal from './DeploymentModal'

const WireframeToolOff = () => {
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const descriptionRef = useRef(null); // Create a ref to hold the value of the text area
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true); // State to track the submit button's disabled status
  const lastMessageRef = useRef(null);
  const navigate = useRouter();



useEffect(()=>{
  refreshProject();
})

  
  

  const updateProject = (projectId, response, userDescription) => {
    console.log('project to refresh:', project);

    axios.post(`${API_BASE_URL}/projects/update`, {
      project_id: projectId, 
      result: response,
      user_input: userDescription
    })
      .then((response) => {
        loadProjectDetails(response.data.project);
      })
      .catch((error) => {
        console.error('Error refreshing project:', error);
        // Handle error as needed
      });
  };

  const handleDeleteProject = (projectToDelete) => {
    console.log('Project to delete:', projectToDelete);
    console.log('Project:', project);

    if (projectToDelete.id === project.id) {
      loadProjectDetails({
        id: null,
        name: '',
        users: [],
        projectStates: [],
        cssFramework: ''
      });
    }
  };

  const loadProjectDetails = (project) => {
    const updatedProject = {
      id: project.id,
      name: project.name,
      users: project.users,
      projectStates: project.projectStates.map((state) => ({
        reactCode: state.reactCode,
        cssCode: state.cssCode,
        messages: state.messages,
        projectStateId: state.projectStateId
      })),
      cssFramework: project.cssFramework
    };

    console.log('Loading project details:', project);
    setProject(updatedProject);
    loadProjectState(updatedProject.projectStates[project.projectStates.length - 1]);
  };



  const [selectedProjectState, setSelectedProjectState] = useState(null);



  // Latest state has all the messages. TODO: Decide how to allow users to proceed from a previous prompt.
  // Do users want to truncate from a prompt (remove everything after a prompt)?


 
  useEffect(() => { // Effect to monitor changes to the descriptionRef's value
    const checkDescription = () => {
      const descriptionValue = descriptionRef.current ? descriptionRef.current.value.trim() : '';
      console.log("Current description value:", descriptionValue);
      setIsSubmitBtnDisabled(loading || resetting || descriptionValue === ''); // Update the submit button's disabled status based on loading and description value
    };

    checkDescription(); 

    descriptionRef.current.addEventListener('input', checkDescription); // Add an input event listener
  
    return () => {
      if (descriptionRef.current) {
        descriptionRef.current.removeEventListener('input', checkDescription); // Clean up the event listener
      }
    };
  }, [loading, resetting]); // The effect will re-run when loading changes


  const navigateToDeployments = () => {
    navigate("/deployments")
  };

  const handleCreateDeployment = async(projectStateId) => {
    setIsDeploymentsModalOpen(true);
    setProjectStateId(projectStateId);
    console.log("Opened Deployments Modal");
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = descriptionRef.current ? descriptionRef.current.value : '';
    setLoading(true);
    setErrorState(null);
    setGenerationSpinner(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, { description, project_id: project.id });
      const taskId = response.data.task_id;

      async function verifyTask() {
        const taskResponse = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
        const { ready, successful, value } = taskResponse.data;
        if (ready) {
          clearTimeout();
          updateProject(project.id, value, description);
          setLoading(false);
          descriptionRef.current.value = '';
          setGenerationSpinner(false); 
        }
        else {
          setTimeout(verifyTask, 2000);
        }
      }
      verifyTask();

      console.log('Received string:', response.data);

    } catch (error) {
      const errorString = `An error occurred: ${error.message}`;
      console.error('An error occurred:', error);
      setErrorState(errorString);
    }
  };

  // Function to handle the reset action
  const handleReset = async () => {
    setResetting(true);
    setErrorState(null);
    try {
      await axios.post(`${API_BASE_URL}/reset`, { project_id: project.id}); // Call the server's reset endpoint
      
      setProject({
        id: project.id,
        name: project.name,
        users: project.users,
        projectStates: [],
        cssFramework: project.cssFramework
      });

      setSelectedProjectState(null);

      if (descriptionRef.current) {
        descriptionRef.current.value = '';
      }
      console.log('State has been reset');
    } catch (error) {
      const errorString = `An error occurred: ${error.message}`;
      console.error('An error occurred:', error);
      setErrorState(errorString);
    } finally {
      setResetting(false);
    }
  };

  const handleTranscription = (transcript) => {
    if (descriptionRef.current) {
      descriptionRef.current.value = transcript; // Populate the text area with the transcript
      console.log("Current isSubmitBtnDisabled value:", isSubmitBtnDisabled);
      console.log("Current project.id value:", project.id);
    }

    setIsSubmitBtnDisabled(false);
  };

  return (
    <>
    <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginTop: '15px' }}>{  'Welcome! Please click on \'Projects\' below and select a project.'}</h2>
      <div className="preview-container" style={{ flex: 1, overflow: 'auto', border: '2px solid', borderRadius: '10px' }}>
        {<LiveCodeEditor  css={cssCode()} cssFramework={project.cssFramework} fullScreen={false} />}
      </div>
      <div className="border rounded" style={{ overflowY: 'scroll', maxHeight: '100px', marginTop: '15px' }}>
        <ul className="list-group">
          {messages()
            .filter(message => settings.show_assistant_messages || message.role === 'user')
            .map((message, index, arr) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center" ref={index === arr.length - 1 ? lastMessageRef : null}>
                <div>
                <strong>
                    {
                      message.role === 'assistant' 
                        ? message.model_name 
                        : (message.user_email || "Anonymous")
                    }
                  </strong> <span className="text-muted">{message.created_at}</span>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <div>
                  {message.role === 'user' && <button className="btn btn-outline-success btn-sm" onClick={() => handleCreateDeployment(project.projectStates[index].projectStateId)} value={index}>Create Deployment</button>}
                  {message.role === 'user' && <button className="btn btn-outline-primary btn-sm" onClick={() => loadProjectState(project.projectStates[index])}>Load</button>}
                </div>
              </li>
            ))
          }
        </ul>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '15px', marginBottom: '15px' }}>
        <div className="mb-3 d-flex align-items-center">
          <textarea
            ref={descriptionRef}
            id="description"
            className="form-control"
            rows="2"
            placeholder="Write something like: 'Build me a contact form for my website'"
          />
        </div>
        <div class="mb-3">
         { showGenerationSpinner? 
         <div class="d-flex flex-row">
            <div role="status">
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>

            <h5 class="ml-3">Generating...This may take a while!</h5>
          </div> : null}
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button type="submit" className="btn btn-primary" disabled={project.id === null || isSubmitBtnDisabled}>
            {loading ? 'Generating...' : 'Generate Code'}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleReset} disabled={project.id === null || loading || resetting}>
            Reset
          </button>
          <button type="button" className="btn btn-success" onClick={navigateToDeployments}>
            Deployments
          </button>
          <button type="button" className="btn btn-info" onClick={handleOpenProjectsModal} disabled={loading || resetting}>
            Projects
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleOpenSettingsModal} disabled={loading || resetting}>
            Settings
          </button>
          <button type="button" className="btn btn-warning" onClick={handleSignOut}>
            Sign Out
          </button>
      </div>
      </form>
      {errorState && (
        <div className="mt-4">
          <h3>Error:</h3>
          <p>{errorState}</p>
        </div>
      )}
    </div>
    <ProjectsModal isOpen={isProjectsModalOpen} onClose={handleCloseProjectsModal} onSelectProject={loadProjectDetails} onDeleteProject={handleDeleteProject} />
    <DeploymentModal isOpen={isDeploymentsModalOpen} onClose={handleCloseDeploymentsModal} projectStateId = {projectStateId} />
   
    </>
  );

      }
export default WireframeToolOff;

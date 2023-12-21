import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';
import axios from 'axios';
import LiveCodeEditor from './LiveCodeEditor';
import { API_BASE_URL } from './config';
import Spinner from 'react-bootstrap/Spinner';
import ReactMarkdown from 'react-markdown';

const AnonymousWireframeTool = () => {
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const descriptionRef = useRef(null); // Create a ref to hold the value of the text area
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true); // State to track the submit button's disabled status
  const [showGenerationSpinner, setGenerationSpinner] = useState(false);
  const lastMessageRef = useRef(null);

  const [project, setProject] = useState(() => {
    return JSON.parse(localStorage.getItem('project')) || {
      id: null,
      name: '',
      users: [],
      projectStates: [],
      cssFramework: ''
    };
  });

  useEffect(() => {
    createProject();
  }, []);

  const refreshProject = (projectId) => {
    console.log('project to refresh:', project);

    axios.get(`${API_BASE_URL}/get-anonymous-project`, { params: {
      project_id: projectId, 
    } })
      .then((response) => {
        loadProjectDetails(response.data.project);
      })
      .catch((error) => {
        console.error('Error refreshing project:', error);
        // Handle error as needed
      });
  };

  const createProject = () => {
    console.log("Creating Project");
    axios.post(`${API_BASE_URL}/create-anonymous-project`)
      .then((response) => {
        loadProjectDetails(response.data.project);
      })
      .catch((error) => {
        console.error('Error refreshing project:', error);
        // Handle error as needed
      });
  }

  const updateProject = (projectId, response, userDescription) => {
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

  

  useEffect(() => {
    localStorage.setItem('project', JSON.stringify(project));
  }, [project]);

  const [selectedProjectState, setSelectedProjectState] = useState(null);

  const getProjectState = () => selectedProjectState || project.projectStates[project.projectStates.length - 1] || {};

  const getLatestState = () => project.projectStates[project.projectStates.length - 1] || {};
  
  const reactCode = () => {
    const code = getProjectState().reactCode || '';
    return code ? `export default ${code}` : '';
  };

  const cssCode = () => getProjectState().cssCode || '';
  // Latest state has all the messages. TODO: Decide how to allow users to proceed from a previous prompt.
  // Do users want to truncate from a prompt (remove everything after a prompt)?
  const messages = () => getLatestState().messages || [];

  useLayoutEffect(() => {
    console.log("messages():", messages());

    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages()]);

  const loadProjectState = (projectState) => {
    setSelectedProjectState(projectState);
    console.log("Loading project state:", projectState);
  };

  // useEffect(() => { // Effect to monitor changes to the descriptionRef's value
  //   const checkDescription = () => {
  //     const descriptionValue = descriptionRef.current ? descriptionRef.current.value.trim() : '';
  //     console.log("Current description value:", descriptionValue);
  //     setIsSubmitBtnDisabled(loading || resetting || descriptionValue === ''); // Update the submit button's disabled status based on loading and description value
  //   };

  //   checkDescription(); 

  //   descriptionRef.current.addEventListener('input', checkDescription); // Add an input event listener
  
  //   return () => {
  //     if (descriptionRef.current) {
  //       descriptionRef.current.removeEventListener('input', checkDescription); // Clean up the event listener
  //     }
  //   };
  // }, [loading, resetting]); // The effect will re-run when loading changes
  
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

  return (
    <>
    <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '50vh' }}>
      <h2 style={{ textAlign: 'center', marginTop: '15px' }}>Tell us what you want to build!</h2>
      <div className="preview-container" style={{ flex: 1, overflow: 'auto', border: '2px solid', borderRadius: '10px' }}>
        {reactCode() && <LiveCodeEditor code={reactCode()} css={cssCode()} cssFramework={project.cssFramework} fullScreen={false} />}
      </div>
      <div className="border rounded" style={{ overflowY: 'scroll', maxHeight: '100px', marginTop: '15px' }}>
        <ul className="list-group">
          {messages()
            .filter(message => true || message.role === 'user')
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
            rows="4"
            placeholder="Write something like: 'Build me a contact form for my website'"
          />
        </div>
        <div className="mb-3">
         { showGenerationSpinner? 
         <div className="d-flex flex-row">
            <Spinner animation="border"/>
            <h5 className="ml-3">Generating...This may take a while!</h5>
          </div> : null}
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button type="submit" className="btn btn-primary" disabled={project.id === null || isSubmitBtnDisabled}>
            {loading ? 'Generating...' : 'Generate Code'}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleReset} disabled={project.id === null || loading || resetting}>
            Reset
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
    </>
  );
};

export default AnonymousWireframeTool;

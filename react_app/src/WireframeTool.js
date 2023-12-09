import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import LiveCodeEditor from './LiveCodeEditor';
import ProjectsModal from './ProjectsModal';
import RecordingComponent from './RecordingComponent';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { API_BASE_URL } from './config';
import Settings from './Settings';
import Spinner from 'react-bootstrap/Spinner';
import { useSettings } from './SettingsContext';
import ReactMarkdown from 'react-markdown';

const WireframeTool = () => {
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const descriptionRef = useRef(null); // Create a ref to hold the value of the text area
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true); // State to track the submit button's disabled status
  const { isAuthenticated, isGuest, signOut } = useContext(AuthContext);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [showGenerationSpinner, setGenerationSpinner] = useState(false);
  const { settings } = useSettings();
  const lastMessageRef = useRef(null);

  const handleOpenSignInModal = () => {
    setIsSignInModalOpen(true);
  };

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handleOpenSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const handleOpenProjectsModal = () => {
    setIsProjectsModalOpen(true);
  };

  const handleCloseProjectsModal = () => {
    setIsProjectsModalOpen(false);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isGuest:", isGuest);
    if (isAuthenticated) {
      handleCloseSignUpModal();
      handleCloseSignInModal();

      refreshProject();
    }
  }, [isAuthenticated, isGuest]);

  const refreshProject = () => {
    console.log('project to refresh:', project);

    axios.get(`${API_BASE_URL}/get-project`, { params: {
      project_id: project.id, 
      project_name: project.name 
    } })
      .then((response) => {
        loadProjectDetails(response.data.project);
      })
      .catch((error) => {
        console.error('Error refreshing project:', error);
        // Handle error as needed
      });
  };

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
        messages: state.messages
      })),
      cssFramework: project.cssFramework
    };

    console.log('Loading project details:', project);
    setProject(updatedProject);
    loadProjectState(updatedProject.projectStates[project.projectStates.length - 1]);
  };

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

  const wireframeCSS = `
    body {
      background-color: #f0f0f0;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      color: #333;
    }

    * {
      box-sizing: border-box;
    }

    div, section, article, header, footer, main, nav, aside, h1, h2, h3, h4, h5, h6, p, ul, ol, li, table, img, figure, figcaption, blockquote, details, summary, hr, dl, dt, dd {
      border: 2px dashed #aaa;
      padding: 10px;
      margin: 5px;
    }

    button, input, textarea, select, a {
      border: 2px dashed #aaa;
      padding: 10px;
      margin: 5px;
    }

    button, input[type="button"], input[type="submit"], a {
      cursor: pointer;
      background-color: #f5f5f5;
    }

    input[type="text"], input[type="email"], input[type="password"], textarea, select {
      width: 100%;
    }

    a {
      text-decoration: underline;
    }

    ul, ol {
      list-style-type: circle;
    }

    table {
      border-collapse: collapse;
    }

    th, td {
      text-align: left;
      padding: 8px;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    input[type="radio"], input[type="checkbox"] {
      width: auto;
      border: none;
      margin: 5px;
    }

    progress {
      width: 100%;
    }

    /* Hand-drawn appearance for scrollbars */
    ::-webkit-scrollbar {
      width: 12px;
    }

    ::-webkit-scrollbar-track {
      background: #f0f0f0;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    /* Additional sketchy styles for specific components can be added here */
  `;

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

  // Function to handle the logout action
  const handleSignOut = async () => {
    try {
      await axios.post(`${API_BASE_URL}/sign-out`); // Call the server's logout endpoint

      localStorage.removeItem('project');

      loadProjectDetails({
        id: null,
        name: '',
        users: [],
        projectStates: [],
        cssFramework: ''
      });

      setSelectedProjectState(null);

      signOut(); // Call the logout function from the context
      console.log('Successfully signed out');
    } catch (error) {
      const errorString = `An error occurred: ${error.message}`;
      console.error('An error occurred:', error);
      setErrorState(errorString);
    }
  };

  const createZipAndDownload = async (files) => {
    const zip = new JSZip();
  
    files.forEach(file => {
      zip.file(file.name, file.content);
    });
  
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "code-files.zip");
  }

  const downloadFile = () => {
    const eventProperties = {
      is_authenticated: isAuthenticated,
    };
    
    if (!isAuthenticated) {
      alert('Please sign in or sign up to download code.');
      return;
    }

    const files = [
      { name: 'react-code.js', content: reactCode() },
      { name: 'styles.css', content: cssCode() }
    ];

    createZipAndDownload(files);
  };
  
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
      <h2 style={{ textAlign: 'center', marginTop: '15px' }}>{project.name || 'Welcome! Please click on \'Projects\' below and select a project.'}</h2>
      <div className="preview-container" style={{ flex: 1, overflow: 'auto', border: '2px solid', borderRadius: '10px' }}>
        {reactCode() && <LiveCodeEditor code={reactCode()} css={cssCode()} cssFramework={project.cssFramework} />}
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
                {message.role === 'user' && <button className="btn btn-outline-primary btn-sm" onClick={() => loadProjectState(project.projectStates[index])}>Load</button>}
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
          <RecordingComponent onTranscription={handleTranscription} isDisabled={project.id === null || loading || resetting} />
        </div>
        <div class="mb-3">
         { showGenerationSpinner? 
         <div class="d-flex flex-row">
            <Spinner animation="border"/>
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
          <button type="button" className="btn btn-success" onClick={downloadFile} disabled={!reactCode()}>
            Download Code
          </button>
          <button type="button" className="btn btn-info" onClick={handleOpenProjectsModal} disabled={loading || resetting}>
            Projects
          </button>
          {isAuthenticated ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={handleOpenSettingsModal} disabled={loading || resetting}>
                Settings
              </button>
              <button type="button" className="btn btn-warning" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-primary" onClick={handleOpenSignInModal}>
                Sign In
              </button>
              <button type="button" className="btn btn-primary" onClick={handleOpenSignUpModal}>
                Sign Up
              </button>
            </>
          )}
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
    <Settings isOpen={isSettingsModalOpen} onClose={handleCloseSettingsModal} />
    <div className={`modal fade ${isSignInModalOpen && !isAuthenticated ? 'show d-block' : 'd-none'}`} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sign In</h5>
              <button type="button" className="btn-close" onClick={handleCloseSignInModal}></button>
            </div>
            <div className="modal-body" style={{ width: '100%', height: '100%' }}>
              {!isAuthenticated && <SignIn key={isAuthenticated ? 'authenticated' : 'unauthenticated'} />}
            </div>
          </div>
        </div>
    </div>
    <div className={`modal fade ${isSignUpModalOpen && !isAuthenticated ? 'show d-block' : 'd-none'}`} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sign Up</h5>
              <button type="button" className="btn-close" onClick={handleCloseSignUpModal}></button>
            </div>
            <div className="modal-body" style={{ width: '100%', height: '100%' }}>
              {!isAuthenticated && <SignUp key={isAuthenticated ? 'authenticated' : 'unauthenticated'} />}
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default WireframeTool;

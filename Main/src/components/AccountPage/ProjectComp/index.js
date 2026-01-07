import React, { useEffect, useState, useContext } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { AuthContext } from "../../../context/AuthContext";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import "./index.scss";
import { authUtils } from "../../../utils/auth";

export default function ProjectComponent({ onUpdate }) {

  //Initialize states and define variables that will be used later.
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [userData, setUserData] = useState(authUtils.getStoredUserData());

  // Makes an API call to the backend to fetch all data from the projects table.
  useEffect(() => {
    if (userData) {
      fetchProjects();
    }
  }, [userData]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/user_projects"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch projects.");
      }

      const projectDataArray = await response.json();

      const userProject = projectDataArray.filter((projectData) => {
        return projectData.user_id === userData?.user_id;
      });

      console.log("User Projects:", userProject);

      const formattedProjects = userProject.map((projectData) => ({
        index: projectData?.user_id || "No ID",
        project_id: projectData.project_id,
        project_name: projectData?.project_name || "Unnamed Project",
        project_description: projectData?.project_description || "No Description",
      }));

      setProjects(formattedProjects);


    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  // This funtion call the API and add a new project to the table.
  const addProject = async () => {
    if (formData.name && formData.description) {
      try {
        const response = await fetch("http://localhost:4000/user_projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userData.user_id,
            project_name: formData.name,
            project_description: formData.description,
          }),
        });

        if (response.ok) {
          const newProject = await response.json();

          setDialogVisible(false);
          fetchProjects();
          await onUpdate();

        } else {
          console.error("Failed to add project:", await response.text());
        }
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };

  // Delete a project from the table.
  // Delete a project from the table.
  const deleteProject = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/user_projects/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Instead of manually filtering, call fetchProjects to refresh the list
        await fetchProjects();
        await onUpdate();
      } else {
        console.error("Failed to delete project:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle project removal
  const handleRemoveProject = (id) => {
    confirmDialog({
      message: 'Are you sure you want to delete this project?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptClassName: 'p-button-secondary',
      rejectClassName: 'p-button-outlined',
      acceptLabel: 'Yes, delete',
      rejectLabel: 'No, cancel',
      accept: () => deleteProject(id)
    });
  };

  return (
    // This block of code is the card template in the user edit dialog, allow this component to be instiated and iterate through the code to auto format cards based on the backend data.
    <div className="container">
      <div className="header">
        <h1 className="projects-title">Projects</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => setDialogVisible(true)}
          tooltip="Add Project"
        />
      </div>

      <Dialog
        header="Add Project"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Project Name</label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <Button
            label="Add"
            className="p-button-primary"
            onClick={addProject}
            style={{ marginTop: "1rem" }}
          />
        </div>
      </Dialog>

      <div className="projects-list">
        {projects.map((item, index) => (
          // console.log(`Item: ${JSON.stringify(item)}`),
          <Card key={item.index} title={item.project_name} className="card">
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-sm card-button"
              onClick={() => handleRemoveProject(item.project_id)}
              tooltip="Remove"
            />
            <p>{item.project_description}</p>
          </Card>
        ))}
      </div>
      <ConfirmDialog />
    </div>
  );
}

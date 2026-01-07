import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { AuthContext } from "../../../context/AuthContext";
import "./index.scss";
import { authUtils } from "../../../utils/auth";

const SkillComponent = ({ onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [skillsEdit, setSkills] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [userData, setUserData] = useState(authUtils.getStoredUserData());

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/user_skills"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const skillsDataArray = await response.json();

      const userSkillsData = skillsDataArray.filter(
        (skillData) => skillData.user_id === userData?.user_id
      );

      const formattedSkills = userSkillsData.map((skillData) => ({
        id: skillData.user_id,
        skill_id: skillData.skill_id,
        name: skillData?.skill_name || "",
        description: skillData?.skill_description || "",
      }));
      setSkills(formattedSkills);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user's skill data
  useEffect(() => {
    if (userData) {
      fetchSkills();
    }
  }, [userData]);

  // Handle input changes in the dialog
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new skill entry
  const handleAddSkill = async () => {
    try {
      if (formData.name && formData.description) {
        const skillDataInsert = {
          user_id: userData?.user_id,
          skill_name: formData.name,
          skill_description: formData.description,
        };

        console.log(formData)

        const response = await fetch(
          "http://localhost:4000/user_skills",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(skillDataInsert),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create skill.");
        }

        setSkills([...skillsEdit, formData]);
        setFormData({ name: "", description: "" });
        setDialogVisible(false);
        await fetchSkills();
        if (onUpdate) {
          await onUpdate();
        }
      }
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  // Delete a skill
  const deleteSkill = async (skillId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/user_skills/${skillId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete skill.", response.message);
      }

      setSkills((prev) => prev.filter((skill) => skill.skill_id !== skillId));
      await fetchSkills();
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handleDeleteClick = (skillId) => {
      confirmDialog({
          message: 'Are you sure you want to delete this skill?',
          header: 'Delete Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          acceptClassName: 'p-button-secondary',
          rejectClassName: 'p-button-outlined',
          acceptLabel: 'Yes, delete',
          rejectLabel: 'No, cancel',
          accept: () => deleteSkill(skillId)
      });
  };
  

  return (
    <div className="container">
      {/* <ConfirmDialog /> */}
      <div className="header">
        <h1 className="skills-title">Skills</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => setDialogVisible(true)}
          tooltip="Add Skill"
        />
      </div>

      <Dialog
        header="Add Skill"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Skill Name</label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <Button
            label="Add"
            className="p-button-primary"
            onClick={handleAddSkill}
          />
        </div>
      </Dialog>

      <div className="skills-list">
        {skillsEdit.map((item, index) => (
          <Card key={index} title={item.name} className="card">
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-sm card-button"
              onClick={() => handleDeleteClick(item.skill_id)}
              tooltip="Remove"
            />
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillComponent;

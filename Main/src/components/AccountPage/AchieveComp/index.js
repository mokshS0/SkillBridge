import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { confirmDialog } from 'primereact/confirmdialog';
import { AuthContext } from "../../../context/AuthContext";
import "./index.scss";
import { authUtils } from "../../../utils/auth";

const AchieveComponent = ({ onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [achieveList, setAchieveList] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [userData, setUserData] = useState(authUtils.getStoredUserData());

  const fetchAchievements = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/user_achievements"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch achievements.");
      }

      const achievementsDataArray = await response.json();

      const userAchievements = achievementsDataArray.filter((achievement) => {
        return achievement.user_id === userData?.user_id;
      });

      const formattedAchievements = userAchievements.map((achievement) => {
        return {
          id: achievement.user_id || "No ID",
          achievement_id: achievement.achievement_id || "No ID",
          name: achievement?.achievement_name || "Unnamed Achievement",
          description: achievement?.achievement_description || "No Description",
        };
      });

      setAchieveList(formattedAchievements);

    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchAchievements();
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAchievement = async () => {
    try {
      if (formData.name && formData.description) {
        const achievementData = {
          user_id: userData?.user_id,
          achievement_name: formData.name,
          achievement_description: formData.description,
        };

        const response = await fetch(
          "http://localhost:4000/user_achievements",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(achievementData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add achievement.");
        }

        setAchieveList([...achieveList, formData]);
        setFormData({ name: "", description: "" });
        setDialogVisible(false);
        await fetchAchievements();
        if (onUpdate) {
          await onUpdate();
        }
      }
    } catch (error) {
      console.error("Error adding achievement:", error);
    }
  };

  const deleteAchievement = async (achievementId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/user_achievements/${achievementId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete achievement.");
      }

      setAchieveList((prev) =>
        prev.filter((achievement) => achievement.achievement_id !== achievementId)
      );
      await fetchAchievements();
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  const handleDeleteClick = (achievementId) => {
    confirmDialog({
      message: 'Are you sure you want to delete this achievement?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptClassName: 'p-button-secondary',
      rejectClassName: 'p-button-outlined',
      acceptLabel: 'Yes, delete',
      rejectLabel: 'No, cancel',
      accept: () => deleteAchievement(achievementId)
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="achievements-title">Achievements</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => setDialogVisible(true)}
          tooltip="Add Achievement"
        />
      </div>

      <Dialog
        header="Add Achievement"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Achievement Name</label>
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
            onClick={handleAddAchievement}
          />
        </div>
      </Dialog>

      <div className="achievements-list">
        {achieveList.map((item, index) => (
          <Card
            key={index}
            title={item.name}
            className="card"
          >
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-sm card-button"
              onClick={() => handleDeleteClick(item.achievement_id)}
              tooltip="Remove"
            />
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AchieveComponent;

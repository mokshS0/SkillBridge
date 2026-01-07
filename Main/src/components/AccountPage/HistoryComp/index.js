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
import { removeHooks } from "dompurify";

const HistoryComponent = ({ onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [workHistoryEdit, setWorkHistory] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  });
  const [userData, setUserData] = useState(authUtils.getStoredUserData());

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/user_history"
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const historyDataArray = await response.json();

      const userHistoryData = historyDataArray.filter(
        (historyData) => historyData.user_id === userData?.user_id
      );

      // console.log(userHistoryData[0].history_id);

      const formattedHistory = userHistoryData.map((historyData) => ({
        id: historyData.id,
        history_id: historyData.history_id,
        company: historyData?.company_name || "",
        role: historyData?.role || "",
        duration: historyData?.duration || "",
        description: historyData?.description || "",
      }));

      setWorkHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchHistory();
    }
    console.log("user data", userData);
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddWorkHistory = async () => {
    try {
      if (
        formData.company &&
        formData.role &&
        formData.duration &&
        formData.description
      ) {
        const historyDataInsert = {
          user_id: userData?.user_id,
          company_name: formData.company,
          role: formData.role,
          duration: formData.duration,
          description: formData.description,
        };

        const response = await fetch(
          "http://localhost:4000/user_history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(historyDataInsert),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create job posting");
        }

        setWorkHistory([...workHistoryEdit, formData]);
        setFormData({ company: "", role: "", duration: "", description: "" });
        setDialogVisible(false);
        await fetchHistory();
        if (onUpdate) {
          await onUpdate();
        }
      }
    } catch (error) {
      console.error("Error adding work history:", error);
    }
  };

  const deleteHistory = async (historyId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/user_history/${historyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(response.message);
      }

      setWorkHistory((prev) =>
        prev.filter((history) => history.history_id !== historyId)
      );
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  const handleDeleteClick = (historyId) => {
    console.log("history id", historyId);
    confirmDialog({
      message: 'Are you sure you want to delete this work history entry?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptClassName: 'p-button-secondary',
      rejectClassName: 'p-button-outlined',
      acceptLabel: 'Yes, delete',
      rejectLabel: 'No, cancel',
      accept: () => deleteHistory(historyId)
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="history-title">Work History</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => setDialogVisible(true)}
          tooltip="Add Work History"
        />
      </div>

      <Dialog
        header="Add Work History"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="company">Company</label>
            <InputText
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="role">Role</label>
            <InputText
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="duration">Duration</label>
            <InputText
              id="duration"
              name="duration"
              value={formData.duration}
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
            onClick={handleAddWorkHistory}
          />
        </div>
      </Dialog>

      <div className="work-history-list">
        {workHistoryEdit.map((item, index) => (
          console.log(item.history_id),
          <Card
            key={index}
            title={item.company}
            subTitle={`${item.role} (${item.duration})`}
            className="card"
          >
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger p-button-sm card-button"
              onClick={() => handleDeleteClick(item.history_id)}
              tooltip="Remove"
            />
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryComponent;

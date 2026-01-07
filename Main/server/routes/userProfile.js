const express = require('express');
const router = express.Router();

const UserSkill = require('../models/UserSkill');
const UserProject = require('../models/UserProject');
const UserHistory = require('../models/UserHistory');
const UserAchievement = require('../models/UserAchievement');
const auth = require('../middleware/auth');

// ========== SKILLS ROUTES ==========

// GET /user_skills
router.get('/user_skills', auth, async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id ? { user_id } : {};
    const skills = await UserSkill.find(query).sort({ date_added: -1 });
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /user_skills
router.post('/user_skills', auth, async (req, res) => {
  try {
    const { user_id, skill_name, proficiency_level } = req.body;
    const newSkill = new UserSkill({
      user_id: user_id || req.user.user_id,
      skill_name,
      proficiency_level
    });
    const skill = await newSkill.save();
    res.status(201).json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /user_skills/:id
router.put('/user_skills/:id', auth, async (req, res) => {
  try {
    const skill = await UserSkill.findOne({ skill_id: req.params.id });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        skill[key] = req.body[key];
      }
    });
    await skill.save();
    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /user_skills/:id
router.delete('/user_skills/:id', auth, async (req, res) => {
  try {
    await UserSkill.deleteOne({ skill_id: req.params.id });
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========== PROJECTS ROUTES ==========

// GET /user_projects
router.get('/user_projects', auth, async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id ? { user_id } : {};
    const projects = await UserProject.find(query).sort({ date_created: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /user_projects
router.post('/user_projects', auth, async (req, res) => {
  try {
    const { user_id, project_name, project_description, project_url, technologies_used } = req.body;
    const newProject = new UserProject({
      user_id: user_id || req.user.user_id,
      project_name,
      project_description,
      project_url,
      technologies_used: technologies_used || []
    });
    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /user_projects/:id
router.put('/user_projects/:id', auth, async (req, res) => {
  try {
    const project = await UserProject.findOne({ project_id: req.params.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        project[key] = req.body[key];
      }
    });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /user_projects/:id
router.delete('/user_projects/:id', auth, async (req, res) => {
  try {
    await UserProject.deleteOne({ project_id: req.params.id });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========== HISTORY ROUTES ==========

// GET /user_history
router.get('/user_history', auth, async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id ? { user_id } : {};
    const history = await UserHistory.find(query).sort({ date_added: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /user_history
router.post('/user_history', auth, async (req, res) => {
  try {
    const { user_id, title, description, start_date, end_date, organization } = req.body;
    const newHistory = new UserHistory({
      user_id: user_id || req.user.user_id,
      title,
      description,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      organization
    });
    const history = await newHistory.save();
    res.status(201).json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /user_history/:id
router.put('/user_history/:id', auth, async (req, res) => {
  try {
    const history = await UserHistory.findOne({ history_id: req.params.id });
    if (!history) {
      return res.status(404).json({ message: 'History entry not found' });
    }
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'start_date' || key === 'end_date') {
          history[key] = new Date(req.body[key]);
        } else {
          history[key] = req.body[key];
        }
      }
    });
    await history.save();
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /user_history/:id
router.delete('/user_history/:id', auth, async (req, res) => {
  try {
    await UserHistory.deleteOne({ history_id: req.params.id });
    res.json({ message: 'History entry deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========== ACHIEVEMENTS ROUTES ==========

// GET /user_achievements
router.get('/user_achievements', auth, async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id ? { user_id } : {};
    const achievements = await UserAchievement.find(query).sort({ date_added: -1 });
    res.json(achievements);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /user_achievements
router.post('/user_achievements', auth, async (req, res) => {
  try {
    const { user_id, achievement_name, description, date_earned, issuer } = req.body;
    const newAchievement = new UserAchievement({
      user_id: user_id || req.user.user_id,
      achievement_name,
      description,
      date_earned: date_earned ? new Date(date_earned) : undefined,
      issuer
    });
    const achievement = await newAchievement.save();
    res.status(201).json(achievement);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /user_achievements/:id
router.put('/user_achievements/:id', auth, async (req, res) => {
  try {
    const achievement = await UserAchievement.findOne({ achievement_id: req.params.id });
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'date_earned') {
          achievement[key] = new Date(req.body[key]);
        } else {
          achievement[key] = req.body[key];
        }
      }
    });
    await achievement.save();
    res.json(achievement);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /user_achievements/:id
router.delete('/user_achievements/:id', auth, async (req, res) => {
  try {
    await UserAchievement.deleteOne({ achievement_id: req.params.id });
    res.json({ message: 'Achievement deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;


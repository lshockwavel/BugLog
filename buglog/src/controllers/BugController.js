import { Auth0Provider } from "@bcwdev/auth0provider";
import { bugsService } from "../services/BugsService.js";
import BaseController from "../utils/BaseController.js";
import { notesService } from "../services/NotesService.js";
import { trackedbugsService } from "../services/TrackedBugsService.js";


export class BugController extends BaseController {
  constructor() {
    super('api/bugs')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getBugs)
      .get('/:bugId', this.getBugById)
      .post('', this.createBug)
      .get('/:bugId/notes', this.getNotesByBugId)
      .get('/:bugId/trackedbugs', this.getTrackedBugsByBugId)
      .put('/:bugId', this.editBug)
      .delete('/:bugId', this.deleteBug)
      .get('/query/bugs', this.getQueryBugs)
  }

  async createBug(req, res, next) {
    try {
        const bugData = req.body;
        bugData.creatorId = req.userInfo.id;
        const bug = await bugsService.createBug(bugData);
        return res.status(201).json(bug);
    } catch (error) {
      next(error)
    }
  }

  async getBugs(req, res, next) {
    try {
        const query = req.query;
        const bugs = await bugsService.getBugs(query);
        res.send(bugs);
        } catch (error) {
        next(error);
        }
    }

    async getBugById(req, res, next) {
        try {
            const bugId = req.params.bugId;
            const bug = await bugsService.getBugById(bugId);
            res.send(bug);
        } catch (error) {
            next(error);
        }
    }

    async getNotesByBugId(req, res, next) {
        try {
            const bugId = req.params.bugId;
            const notes = await notesService.getNotesByBugId(bugId);
            res.send(notes);
        } catch (error) {
            next(error);
        }
    }

    async getTrackedBugsByBugId(req, res, next) {
        try {
            const bugId = req.params.bugId;
            const trackedBugs = await trackedbugsService.getTrackedBugsByBugId(bugId);
            res.send(trackedBugs);
        } catch (error) {
            next(error);
        }
    }

    async getQueryBugs(req, res, next) {
        try {
            const query = req.query;
            const bugs = await bugsService.getQueryBugs(query);
            res.send(bugs);
        } catch (error) {
            next(error);
        }
    }

    async editBug(req, res, next) {
        try {
            const bugId = req.params.bugId;
            const bugData = req.body;
            bugData.creatorId = req.userInfo.id; // Ensure the creatorId is set
            const updatedBug = await bugsService.updateBug(bugId, bugData);
            res.send(updatedBug);
        } catch (error) {
            next(error);
        }
    }

  async deleteBug(req, res, next) {
    try {
        const bugId = req.params.bugId;
        if (!bugId) {
            throw new Error('Bug ID is required');
        }
        const userId = req.userInfo.id;

        const message = await bugsService.deleteBug(bugId, userId);
        return res.send(message);
    } catch (error) {
      next(error)
    }
  }
}
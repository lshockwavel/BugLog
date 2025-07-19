import { Auth0Provider } from "@bcwdev/auth0provider";
import { trackedbugsService } from "../services/TrackedBugsService.js";
import BaseController from "../utils/BaseController.js";



export class TrackedBugController extends BaseController {
    constructor() {
        super('api/trackedbugs');
        this.router
        .use(Auth0Provider.getAuthorizedUserInfo)
        .post('', this.createTrackedBug)
        .delete('/:trackedBugId', this.deleteTrackedBug);
    }
    
    async createTrackedBug(req, res, next) {
        try {
        const trackedBugData = req.body;
        trackedBugData.accountId = req.userInfo.id; // Ensure the creatorId is set
        const trackedBug = await trackedbugsService.createTrackedBug(trackedBugData);
        return res.status(201).json(trackedBug);
        } catch (error) {
        next(error);
        }
    }
    
    async deleteTrackedBug(req, res, next) {
        try {
            const trackedBugId = req.params.trackedBugId;
            if (!trackedBugId) {
                throw new Error('Tracked Bug ID is required');
            }

        const userId = req.userInfo.id;
        // Ensure the user is authorized to delete this tracked bug
        const message = await trackedbugsService.deleteTrackedBug(trackedBugId, userId);
        return res.status(204).send(message);
        } catch (error) {
        next(error);
        }
    }
}
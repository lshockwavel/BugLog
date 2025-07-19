import { dbContext } from "../db/DbContext.js";


class BugsService {

    async createBug(bugData) {
        const bug = await dbContext.Bug.create(bugData);
        await bug.populate('creator');
        return bug;
    }

    async getBugs() {
        const bugs = await dbContext.Bug.find().populate('creator');
        return bugs;
    }
    
    async getBugById(bugId) {
        const bug = await dbContext.Bug.findById(bugId).populate('creator')
        if (!bug) {
        throw new Error('Bug not found')
        }
        return bug
    }

    async updateBug(bugId, bugData) {
        const bug = await dbContext.Bug.findById(bugId);
        
        //If the bug does not exist, throw an error
        if (!bug) {
            throw new Error('Bug not found');
        }

        //If the user does not have permission to edit the bug, throw an error
        if (bug.creatorId.toString() !== bugData.creatorId) {
            throw new Error('You do not have permission to edit this bug');
        }

        //Start filling in the bug data if it exists
        bug.title = bugData.title || bug.title;
        bug.description = bugData.description || bug.description;
        bug.closed = bugData.closed !== undefined ? bugData.closed : bug.closed;

        if (bug.closed == true)
        {
            bug.closedDate = new Date();
        }
        else
        {
            bug.closedDate = null;
        }

        await bug.save();
        return bug;
    }

    async deleteBug(bugId, userId) {
        const bug = await this.getBugById(bugId)
        if (bug.creatorId.toString() !== userId) {
        throw new Error('You do not have permission to delete this bug')
        }
        await bug.deleteOne();
        return `Bug with ID ${bugId} has been deleted successfully.`;
    }
}

export const bugsService = new BugsService();
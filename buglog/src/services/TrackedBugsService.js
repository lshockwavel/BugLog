import { dbContext } from "../db/DbContext.js";



class TrackedBugsService {

  async createTrackedBug(trackedBugData) {
    const trackedBug = await dbContext.TrackedBug.create(trackedBugData);
    await trackedBug.populate('tracker', 'name picture');
    await trackedBug.populate('bug');
    return trackedBug;
  }

  async getTrackedBugsByBugId(bugId) {
    const trackedBugs = await dbContext.TrackedBug.find({ bugId: bugId }).populate('tracker', 'name picture').populate('bug');
    return trackedBugs;
  }

  async getTrackedBugs(accountId) {
    const trackedBugs = await dbContext.TrackedBug.find({ accountId: accountId }).populate('tracker', 'name picture').populate('bug');
    return trackedBugs;
  }

  async deleteTrackedBug(trackedBugId, userId) {
    const trackedBug = await dbContext.TrackedBug.findById(trackedBugId);
    if (!trackedBug) {
      throw new Error('Tracked Bug not found');
    }
    if (trackedBug.accountId.toString() !== userId) {
      throw new Error('You do not have permission to delete this tracked bug');
    }
    await trackedBug.deleteOne();
    return `Tracked Bug with ID ${trackedBugId} has been deleted successfully.`;
  }
}

export const trackedbugsService = new TrackedBugsService();
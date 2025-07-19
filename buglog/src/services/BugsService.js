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

    async getQueryBugs(query) {
        // If the query is empty, return all bugs
        if (Object.keys(query).length === 0) {
            return this.getBugs();
        }

        // Otherwise, filter bugs based on the query
        const sortBy = query.order;
        delete query.order; //so when the query is sent, it does not include the order or errors

        const pageSize = query.pageSize || 10; // Default page size
        const page = query.page || 1;
        delete query.page;
        const skipAmount = (page - 1) * pageSize;

        const search = query.search;
        delete query.search;
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'ig') },
                { description: new RegExp(search, 'ig') }
            ];
        }

        console.log('finding by: ', query);
        console.log('sorting by: ', sortBy);
        console.log('page: ', page, skipAmount);

        const bugs = await dbContext.Bug.find(query).sort(sortBy + ' createdAt').skip(skipAmount).limit(pageSize).populate('creator')

        const resultCount = await dbContext.Bug.countDocuments(query);

        return {
            query,
            sortBy,
            pageSize,
            page: parseInt(page),
            totalPages: Math.ceil(resultCount / pageSize),
            totalResults: resultCount,
            results: bugs
        };
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
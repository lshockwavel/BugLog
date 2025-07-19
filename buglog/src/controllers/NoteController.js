import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { notesService } from "../services/NotesService.js";

export class NoteController extends BaseController {
  constructor() {
    super('api/notes')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createNote)
      .delete('/:noteId', this.deleteNote)
  }

  async createNote(req, res, next) {
    try {
        const noteData = req.body;
        console.log('Creating note with data:', noteData);
        const creatorId = req.userInfo.id;
        noteData.creatorId = creatorId; // Ensure the creatorId is set

        const note = await notesService.createNote(noteData);
        console.log('Note created:', note);

      return res.status(201).json(note)
    } catch (error) {
      next(error)
    }
  }

  async deleteNote(req, res, next) {
    try {
        const noteId = req.params.noteId;
        console.log('Deleting note with ID:', noteId);
        if (!noteId) {
            throw new Error('Note ID is required');
            }
        const userId = req.userInfo.id;
      const result = await notesService.deleteNote(noteId, userId)
      return res.send(result);
    } catch (error) {
      next(error)
    }
  }
}
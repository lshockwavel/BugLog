import { dbContext } from "../db/DbContext.js";



class NotesService {  
    
    async createNote(noteData) {
    const note = await dbContext.Note.create(noteData);
    await note.populate('creator', 'name picture');

    return note;
  }

  async getNotesByBugId(bugId) {
    const notes = await dbContext.Note.find({ bugId }).populate('creatorId', 'name picture')
    return notes
  }

  async deleteNote(noteId, userId) {
    const note = await dbContext.Note.findById(noteId)
    if (!note) {
      throw new Error('Note not found')
    }
    if (note.creatorId.toString() !== userId) {
      throw new Error('You do not have permission to delete this note')
    }
    await note.deleteOne();

    return `Note with ID ${noteId} has been deleted successfully.`;
  }
}

export const notesService = new NotesService();
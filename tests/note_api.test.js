const { test, after, describe, beforeEach } = require('node:test');
const assert = require('assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper')
const app = require('../app');
const api = supertest(app);

const Note = require('../models/note');


beforeEach(async () => {
    await Note.deleteMany({});

    /* const noteObjects = helper.initialNotes
        .map(n => new Note(n))
    const promiseArray = noteObjects.map(n => n.save());
    await Promise.all(promiseArray) */

    for(let note of helper.initialNotes) {
        const newNote = new Note(note)
        await newNote.save()
    }
})

describe('Methods REST API', () => {
    test('add note', async () => {
        const newNote = {
            content: 'Create from Supertest',
            important: false
        }
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDB();
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

        const contents = notesAtEnd.map(n => n.content);
        assert(contents.includes('Create from Supertest'));
    })

    test('note without content is not added', async () => {
        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)
        const notesAtEnd = await helper.notesInDB();
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    })

    test('get a specific note', async () => {
        const notesAtStart = await helper.notesInDB()
        const noteToView = notesAtStart[0]
        const res = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(res.body, noteToView)
    })

    test('a note can be deleted', async () => {
        const notesAtStart = await helper.notesInDB();
        const noteDeleted = notesAtStart[0];

        await api
            .delete(`/api/notes/${noteDeleted.id}`)
            .expect(200)
        const notesAtEnd = await helper.notesInDB();

        const contents = notesAtEnd.map(n => n.content);
        assert(!contents.includes(noteDeleted))
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })

    test('return notes in format JSON', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('there are one note', async () => {
        const res = await api.get('/api/notes')
        assert.strictEqual(res.body.length, helper.initialNotes.length)
    })
    test('The first note contains firstNote', async () => {
        const res = await api.get('/api/notes')
        const contents = res.body.map(c => c.content)
        assert(contents.includes('HTML is easy'))
    })
})

after(async () => {
    await mongoose.connection.close();
})



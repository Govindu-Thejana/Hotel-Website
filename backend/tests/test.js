import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import cors from "cors";
import roomRoute from '../routes/roomRoute.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(cors()); // Use CORS middleware
app.use('/rooms', roomRoute); // Use your rooms route

describe('Rooms API', () => {
    before(async () => {
        // Connect to the test database
        await mongoose.connect('mongodb://localhost/test_database', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        // Close the database connection
        await mongoose.connection.close();
    });

    describe('GET /rooms', () => {
        it('should respond with status 200 and a JSON object containing the count and data array of rooms', async () => {
            const response = await request(app).get('/rooms');

            expect(response.status).to.equal(200);
            expect(response.type).to.equal('application/json');
            expect(response.body).to.have.property('count').that.is.a('number');
            expect(response.body).to.have.property('data').that.is.an('array');
        });

    });
});

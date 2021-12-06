import express from "express";

export default class AppController {
    constructor() {
        this._router = express.Router();
    }
}

"use strict";
// ipcHandlers.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeIpcHandlers = initializeIpcHandlers;
const electron_1 = require("electron");
function initializeIpcHandlers(appState) {
    electron_1.ipcMain.handle("update-content-dimensions", async (event, { width, height }) => {
        if (width && height) {
            appState.setWindowDimensions(width, height);
        }
    });
    electron_1.ipcMain.handle("delete-screenshot", async (event, path) => {
        return appState.deleteScreenshot(path);
    });
    electron_1.ipcMain.handle("take-screenshot", async () => {
        try {
            const screenshotPath = await appState.takeScreenshot();
            const preview = await appState.getImagePreview(screenshotPath);
            return { path: screenshotPath, preview };
        }
        catch (error) {
            console.error("Error taking screenshot:", error);
            throw error;
        }
    });
    electron_1.ipcMain.handle("get-screenshots", async () => {
        console.log({ view: appState.getView() });
        try {
            let previews = [];
            if (appState.getView() === "queue") {
                previews = await Promise.all(appState.getScreenshotQueue().map(async (path) => ({
                    path,
                    preview: await appState.getImagePreview(path)
                })));
            }
            else {
                previews = await Promise.all(appState.getExtraScreenshotQueue().map(async (path) => ({
                    path,
                    preview: await appState.getImagePreview(path)
                })));
            }
            previews.forEach((preview) => console.log(preview.path));
            return previews;
        }
        catch (error) {
            console.error("Error getting screenshots:", error);
            throw error;
        }
    });
    electron_1.ipcMain.handle("toggle-window", async () => {
        appState.toggleMainWindow();
    });
    electron_1.ipcMain.handle("reset-queues", async () => {
        try {
            appState.clearQueues();
            console.log("Screenshot queues have been cleared.");
            return { success: true };
        }
        catch (error) {
            console.error("Error resetting queues:", error);
            return { success: false, error: error.message };
        }
    });
    // IPC handler for analyzing audio from base64 data
    electron_1.ipcMain.handle("analyze-audio-base64", async (event, data, mimeType) => {
        try {
            const result = await appState.processingHelper.processAudioBase64(data, mimeType);
            return result;
        }
        catch (error) {
            console.error("Error in analyze-audio-base64 handler:", error);
            throw error;
        }
    });
    // IPC handler for analyzing audio from file path
    electron_1.ipcMain.handle("analyze-audio-file", async (event, path) => {
        try {
            const result = await appState.processingHelper.processAudioFile(path);
            return result;
        }
        catch (error) {
            console.error("Error in analyze-audio-file handler:", error);
            throw error;
        }
    });
    // IPC handler for analyzing image from file path
    electron_1.ipcMain.handle("analyze-image-file", async (event, path) => {
        try {
            const result = await appState.processingHelper.getLLMHelper().analyzeImageFile(path);
            return result;
        }
        catch (error) {
            console.error("Error in analyze-image-file handler:", error);
            throw error;
        }
    });
    // IPC handler for analyzing text input
    electron_1.ipcMain.handle("analyze-text-input", async (event, text, language = "cpp") => {
        try {
            const result = await appState.processingHelper.processTextInput(text, language);
            return result;
        }
        catch (error) {
            console.error("Error in analyze-text-input handler:", error);
            throw error;
        }
    });
    // IPC handler for solving coding problems
    electron_1.ipcMain.handle("solve-coding-problem", async (event, problemDescription, language = "cpp") => {
        try {
            const result = await appState.processingHelper.getLLMHelper().solveCodingProblem(problemDescription, language);
            return result;
        }
        catch (error) {
            console.error("Error in solve-coding-problem handler:", error);
            throw error;
        }
    });
    // IPC handler for optimizing code
    electron_1.ipcMain.handle("optimize-code", async (event, code, language = "cpp", requirements) => {
        try {
            const result = await appState.processingHelper.getLLMHelper().optimizeCode(code, language, requirements);
            return result;
        }
        catch (error) {
            console.error("Error in optimize-code handler:", error);
            throw error;
        }
    });
    // IPC handler for debugging code
    electron_1.ipcMain.handle("debug-code", async (event, code, language = "cpp", errorDescription) => {
        try {
            const result = await appState.processingHelper.getLLMHelper().debugCode(code, language, errorDescription);
            return result;
        }
        catch (error) {
            console.error("Error in debug-code handler:", error);
            throw error;
        }
    });
    // IPC handler for formatting code
    electron_1.ipcMain.handle("format-code", async (event, code, language = "cpp") => {
        try {
            const result = await appState.processingHelper.getLLMHelper().formatCode(code, language);
            return result;
        }
        catch (error) {
            console.error("Error in format-code handler:", error);
            throw error;
        }
    });
    electron_1.ipcMain.handle("answer-question", async (event, question) => {
        try {
            const result = await appState.processingHelper.getLLMHelper().answerQuestion(question);
            return result;
        }
        catch (error) {
            console.error("Error answering question:", error);
            throw error;
        }
    });
    // IPC handler for interview question answering
    electron_1.ipcMain.handle("answer-interview-question", async (event, question) => {
        try {
            const result = await appState.processingHelper.getLLMHelper().answerInterviewQuestion(question);
            return result;
        }
        catch (error) {
            console.error("Error answering interview question:", error);
            throw error;
        }
    });
    electron_1.ipcMain.handle("quit-app", () => {
        electron_1.app.quit();
    });
}
//# sourceMappingURL=ipcHandlers.js.map
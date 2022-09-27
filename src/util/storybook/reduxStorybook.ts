import { AnyAction } from "@reduxjs/toolkit";

// This will cause console log messages to print for all actions
// Intended use is for temporarily debugging issues
export function actionConsoleLoggerReducer(state = {}, act: AnyAction){
    const actStr = JSON.stringify(act)
    console.log(actStr)
    return state
}
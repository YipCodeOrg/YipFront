export enum UndoActionType {    
    UndoCreateAddress = "undo/createAddress/undo",
    ClearCreateAddress = "undo/createAddress/clear"
}

export function createAction(type: UndoActionType){
    return {type}
}
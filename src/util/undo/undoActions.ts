export enum UndoActionType {    
    UndoCreateAddress = "undo/createAddress/undo",
    ClearCreateAddress = "undo/createAddress/clear",
    UndoAddFriend = "undo/addFriend/undo",
    ClearAddFriend = "undo/addFriend/clear",
}

export function createAction(type: UndoActionType){
    return {type}
}
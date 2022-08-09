export enum LoadStatus {
    NotLoaded = "NOT_LOADED",
    Pending = "PENDING",
    Failed = "FAILED",
    Loaded = "LOADED"
}

export function getLowestLoadStatus(status: LoadStatus, otherStatuses: LoadStatus[]): LoadStatus{
    const loadStatusOrder = [LoadStatus.Failed, LoadStatus.NotLoaded, LoadStatus.Pending, LoadStatus.Loaded]

    const allStatuses = new Set<LoadStatus>(otherStatuses)
    allStatuses.add(status)

    for(let status of loadStatusOrder){
        if(allStatuses.has(status)){
            return status
        }
    }
    return status
}
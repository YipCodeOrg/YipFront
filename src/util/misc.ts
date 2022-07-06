export const logAndReturnRejectedPromise = (msg: string) => {
    console.log(msg)
    return Promise.reject(msg)
}

export const logAndReject = (reject: (reason?: any) => void, msg: string) => {
    console.log(msg)
    reject(msg)
}
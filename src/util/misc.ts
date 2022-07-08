export const logAndReturnRejectedPromise = (msg: string) => {
    console.error(msg)
    return Promise.reject(msg)
}

export const logAndReject = (reject: (reason?: any) => void, msg: string) => {
    console.error(msg)
    reject(msg)
}

export const HUB_ORIGIN_URL = process.env.REACT_APP_HUB_ORIGIN_URL ?? "http://localhost:8000"
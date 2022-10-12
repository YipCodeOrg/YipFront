export type EditRegistrationsFailedProps = {
    yipCode: string | null,
    clearSubmissionState: () => void,
    retrySubmission: () => void
}

export function EditRegistrationsFailed(props: EditRegistrationsFailedProps){
    return <>Failed</>
}
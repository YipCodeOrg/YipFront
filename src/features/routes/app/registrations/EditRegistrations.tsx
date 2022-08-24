import { Registration } from "../../../../packages/YipStackLib/types/userAddressData"

export type EditRegistrationsProps = {
    registrations: Registration[]
}

export const EditRegistrations: React.FC<EditRegistrationsProps> = ({registrations}) => {
    return <>
        {registrations.map(r => <>{r.name}</>)}
    </>
}
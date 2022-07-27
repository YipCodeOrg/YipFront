import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { useUserDataHubLoad } from "../../userdata/userDataSlice"

export default function Dashboard(){
    
    const [userData, yipCodesStatus] = useUserDataHubLoad()
    
    const loadedText = userData!! ? userData?.data.yipCodes.join(", ") : ""

    return <LogoLoadStateWrapper status = {yipCodesStatus} loadedElement={<>{loadedText}</>}></LogoLoadStateWrapper>
}
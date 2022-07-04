import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { useYipCodesHubLoad } from "../../yipcodes/yipCodesSlice"

export default function Dashboard(){
    
    const [yipcodes, yipCodesStatus] = useYipCodesHubLoad()
    

    return <LogoLoadStateWrapper status = {yipCodesStatus} loadedElement={<>{yipcodes.join(", ")}</>}></LogoLoadStateWrapper>
}
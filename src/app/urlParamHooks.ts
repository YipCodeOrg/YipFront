import { useLocation } from 'react-router-dom'
import { isValidYipCode } from '../packages/YipStackLib/packages/YipAddress/validate/yipCodeValidation'

export default function useUrlParams(): URLSearchParams {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params
}

export function useYipCodeUrlParam(): string | null {
    const yipCodeParamName = "yipcode"
    const urlParams = useUrlParams()
    const value = urlParams.get(yipCodeParamName)
    if(value != null){
        const isValid = isValidYipCode(value)
        if(isValid){
            return value
        }
    }
    return null
}
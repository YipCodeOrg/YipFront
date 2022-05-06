import * as React from "react"
import {
  chakra,
  keyframes,
  ImageProps,
  forwardRef,
  usePrefersReducedMotion,
} from "@chakra-ui/react"
import logo from "./yiplogo.svg"

const shake = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(30%); }
`

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const animation = prefersReducedMotion
    ? undefined
    : `${shake} 20s alternate infinite`

  return <chakra.img animation={animation} src={logo} ref={ref} {...props} />
})

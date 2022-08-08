import React, { useEffect } from 'react'
import { action } from '@storybook/addon-actions'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { Args, ReactFramework } from '@storybook/react'
import { DecoratorFunction } from '@storybook/csf'

const LocationChangeAction = ({children}) => {
  const location = useLocation()

  useEffect(() => {
    if(location.key !== "default")
      action('React Router Location Change')(location)
  }, [location])

  return <>{children}</>
}

const ReactRouterDecorator: DecoratorFunction<ReactFramework, Args> = (Story, context) => {
  return (
    <MemoryRouter>
      <LocationChangeAction>
        <Story {...context}/>
      </LocationChangeAction>
    </MemoryRouter>
  )
}

export default ReactRouterDecorator
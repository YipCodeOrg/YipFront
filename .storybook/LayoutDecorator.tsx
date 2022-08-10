import React from 'react'
import { Args, ReactFramework } from '@storybook/react'
import { DecoratorFunction } from '@storybook/csf'
import { FullAppLayout, FullSiteLayout } from '../src/components/core/pageLayouts'
import { action } from '@storybook/addon-actions'
import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
import { ColorModeSwitcher } from '../src/components/core/ColorModeSwitcher'

const LayoutDecorator: DecoratorFunction<ReactFramework, Args> = (Story, context) => {
  
    const lowercaseTitle = context.title.toLowerCase()
    if(lowercaseTitle.startsWith("app")){
        return <AppLayoutDecorator>
                <Story {...context}/>
            </AppLayoutDecorator>
    }
    if(lowercaseTitle.startsWith("site")){
        return <SiteLayoutDecorator>
                <Story {...context}/>
            </SiteLayoutDecorator>
    }
    return <DefaultLayout>
        <Story {...context}/>
    </DefaultLayout>
}

const layoutProps = {
    isLoggedIn: true,
    isSignedUp: true,
    setIsSigedUp: (b: boolean) => action("Set is Signed Up")(b)
}

const DefaultLayout = ({children}) => {      
    return <ChakraProvider>
        <ColorModeScript/>
        <ColorModeSwitcher justifySelf="flex-end" padding={3}/>
        {children}
    </ChakraProvider>
}

const AppLayoutDecorator = ({children}) => {      
    return <ChakraProvider theme={theme}>
        <ColorModeScript/>
        <FullAppLayout {...layoutProps}>
            {children}
        </FullAppLayout>
    </ChakraProvider>
}

const SiteLayoutDecorator = ({children}) => {      
    return <ChakraProvider>
        <ColorModeScript/>
        <FullSiteLayout {...layoutProps}>
            {children}
        </FullSiteLayout>
    </ChakraProvider>
}

export default LayoutDecorator
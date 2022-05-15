import {
  Box,
  chakra,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

//Non-MVP: extract & share with the NavBar's NavLink component
const NavLink : React.FC<{path: string, text: string }> = ({path, text}) => (
  <Box
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),      
    }}
  >
    <Link to={path}>{text}</Link>    
  </Box>
);

const CompanyLinks = [["/about", "About us"],
  ["/contact", "Contact us"],
  ["/pricing", "Pricing"]];

const SupportLinks = [["/faq", "FAQ"], 
  ["/terms", "Terms of Service"], 
  ["/legal", "Legal"], 
  ["/privacy", "Privacy Policy"]]


export default function Footer() {
  
  let bgCol = useColorModeValue('gray.50', 'gray.900')
  let fgCol = useColorModeValue('gray.700', 'gray.200')
  return (
    <Box
      bg={bgCol}
      color={fgCol}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 2fr' }}
          spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Logo lightCol='#000000' darkCol='#ffffff' size={57}/>              
            </Box>
            <Text fontSize={'sm'}>
              {/*TODO-UPD-2023: Maybe we can have this auto-update e.g. as part of the build process.*/}
              © 2022 YipCode. All rights reserved.
            </Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'https://twitter.com/YipCode'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'YouTube'} href={'https://www.youtube.com/channel/UCW3rMAnOM3Z1rZhmG7RBWsw'}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'https://www.instagram.com/yipcode/'}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader><b>Company</b></ListHeader>    
            {CompanyLinks.map(([link, text]) => (
                <NavLink path={link} text={text}/>
              ))}
            {/*TODO-FF: Wait until app is up & there are some testimonials <Link to="/testimonials">Testimonials</Link>*/}
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader><b>Support</b></ListHeader>   
            {SupportLinks.map(([link, text]) => (
                <NavLink path={link} text={text}/>
              ))}
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
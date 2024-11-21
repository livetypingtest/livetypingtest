import AllRoutes from './config/AllRoutes';
import { ChakraProvider } from '@chakra-ui/react';


const App = () => {
  

  return (
    <ChakraProvider>
      <AllRoutes />
    </ChakraProvider>
  )
}

export default App
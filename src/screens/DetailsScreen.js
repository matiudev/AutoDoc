import Header from "../components/ui/Header";
import { ContainerStack } from "../components/ui/Containers";


const DetailsScreen = () => {
  return (
    <ContainerStack>
      <Header titulo="Stack Screen" profile={false} />
    </ContainerStack>
  );
};

export default DetailsScreen;
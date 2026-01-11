// Собран корневой компонент

import TextExample from "./../components/TextExample";
import ClassExample from "./../components/ClassExample";
import AttributeExample from "./../components/AttributeExample";
import DatasetExample from "./../components/DatasetExample";
import ListExample from "./../components/ListExample";
import DelegationExample from "./../components/DelegationExample";
import FormExample from "./../components/FormExample";
import InputsExample from "./../components/InputsExample";
import ScrollExample from "./../components/ScrollExample";
import SizeExample from "./../components/SizeExample";
import IntersectionExample from "./../components/IntersectionExample";
import PortalExample from "./../components/PortalExample";

export default function App() {
  return (
    <>
      <h1>Examples</h1>

      <TextExample />
      <ClassExample />
      <AttributeExample />
      <DatasetExample />
      <ListExample />
      <DelegationExample />
      <FormExample />
      <InputsExample />
      <ScrollExample />
      <SizeExample />
      <IntersectionExample />
      <PortalExample />
    </>
  );
}

import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  ReferenceInput,
  SelectInput,
  SearchInput,
  FunctionField,
} from "react-admin";

const filters = [<SearchInput key="q" source="q" alwaysOn />];

export const RoomList = () => (
  <List
    sort={{ field: "name", order: "ASC" }}
    perPage={25}
    filters={filters}
    title="Salles"
  >
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="name" label="Nom" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const RoomEdit = () => (
  <Edit title="Modifier la salle">
    <SimpleForm>
      <TextInput source="name" label="Nom de la salle" fullWidth required />
    </SimpleForm>
  </Edit>
);

export const RoomCreate = () => (
  <Create title="Créer une salle">
    <SimpleForm>
      <TextInput source="eventId" label="ID de l'événement" fullWidth required />
      <TextInput source="name" label="Nom de la salle" fullWidth required />
    </SimpleForm>
  </Create>
);

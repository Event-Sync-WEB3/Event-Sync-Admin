import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  SearchInput,
} from "react-admin";
import { Chip } from "@mui/material";

const filters = [<SearchInput key="search" source="q" alwaysOn />];

export const EventList = () => (
  <List
    sort={{ field: "startsAt", order: "DESC" }}
    perPage={25}
    filters={filters}
    title="Événements"
  >
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="title" label="Titre" />
      <TextField source="location" label="Lieu" />
      <DateField source="startsAt" label="Début" showTime locales="fr-FR" />
      <DateField source="endsAt" label="Fin" showTime locales="fr-FR" />
      <TextField source="slug" label="Slug" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

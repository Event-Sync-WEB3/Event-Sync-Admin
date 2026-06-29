import {
  Edit,
  SimpleForm,
  TextInput,
  DateTimeInput,
  TabbedForm,
  useRecordContext,
  ReferenceManyField,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
} from "react-admin";

export const EventEdit = () => (
  <Edit title="Modifier l'événement">
    <SimpleForm>
      <TextInput source="title" label="Titre" fullWidth required />
      <TextInput
        source="description"
        label="Description"
        multiline
        rows={3}
        fullWidth
      />
      <TextInput source="location" label="Lieu" fullWidth />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          width: "100%",
        }}
      >
        <DateTimeInput source="startsAt" label="Date et heure de début" />
        <DateTimeInput source="endsAt" label="Date et heure de fin" />
      </div>
      <TextInput
        source="slug"
        label="Slug (URL)"
        fullWidth
        helperText="Identifiant unique utilisé dans les URLs publiques"
      />
    </SimpleForm>
  </Edit>
);

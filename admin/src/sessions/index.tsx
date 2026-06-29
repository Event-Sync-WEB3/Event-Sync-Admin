import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  DateTimeInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  Create,
  SearchInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  FunctionField,
  useRecordContext,
} from "react-admin";

const filters = [
  <SearchInput key="q" source="q" alwaysOn />,
  <ReferenceInput key="eventId" source="eventId" reference="events" label="Événement">
    <SelectInput optionText="title" />
  </ReferenceInput>,
];

const LiveBadge = () => {
  const record = useRecordContext();
  if (!record) return null;
  const now = new Date();
  const start = new Date(record.startsAt);
  const end = new Date(record.endsAt);
  const isLive = now >= start && now <= end;
  if (!isLive) return null;
  return (
    <span
      style={{
        background: "#ef4444",
        color: "white",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 4,
        letterSpacing: 0.5,
      }}
    >
      LIVE
    </span>
  );
};

export const SessionList = () => (
  <List
    sort={{ field: "startsAt", order: "ASC" }}
    perPage={25}
    filters={filters}
    title="Sessions"
  >
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="title" label="Titre" />
      <DateField source="startsAt" label="Début" showTime locales="fr-FR" />
      <DateField source="endsAt" label="Fin" showTime locales="fr-FR" />
      <TextField source="room.name" label="Salle" />
      <FunctionField
        label="Statut"
        render={(record: any) => {
          const now = new Date();
          const start = new Date(record.startsAt);
          const end = new Date(record.endsAt);
          if (now >= start && now <= end) {
            return (
              <span style={{ background: "#ef4444", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, letterSpacing: 0.5 }}>
                LIVE
              </span>
            );
          }
          if (now < start) {
            return <span style={{ color: "#3b82f6", fontSize: 12 }}>À venir</span>;
          }
          return <span style={{ color: "#888", fontSize: 12 }}>Terminée</span>;
        }}
      />
      <FunctionField
        label="Intervenants"
        render={(record: any) => {
          const speakers = record.speakers || [];
          return speakers.map((sp: any) => sp.speaker?.fullName || sp.fullName).join(", ") || "—";
        }}
      />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const SessionEdit = () => (
  <Edit title="Modifier la session">
    <SimpleForm>
      <TextInput source="title" label="Titre" fullWidth required />
      <TextInput source="description" label="Description" multiline rows={3} fullWidth />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
        <DateTimeInput source="startsAt" label="Heure de début" />
        <DateTimeInput source="endsAt" label="Heure de fin" />
      </div>
      <ReferenceInput source="roomId" reference="rooms" label="Salle">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput source="capacity" label="Capacité (informatif)" min={0} />
    </SimpleForm>
  </Edit>
);

export const SessionCreate = () => (
  <Create title="Créer une session">
    <SimpleForm>
      <ReferenceInput source="eventId" reference="events" label="Événement" required>
        <SelectInput optionText="title" />
      </ReferenceInput>
      <TextInput source="title" label="Titre" fullWidth required />
      <TextInput source="description" label="Description" multiline rows={3} fullWidth />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
        <DateTimeInput source="startsAt" label="Heure de début" required />
        <DateTimeInput source="endsAt" label="Heure de fin" required />
      </div>
      <ReferenceInput source="roomId" reference="rooms" label="Salle">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput source="capacity" label="Capacité (informatif)" min={0} />
    </SimpleForm>
  </Create>
);

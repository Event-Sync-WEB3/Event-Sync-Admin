import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  DeleteButton,
  FunctionField,
  SearchInput,
} from "react-admin";

const filters = [<SearchInput key="q" source="q" alwaysOn />];

export const QuestionList = () => (
  <List
    sort={{ field: "upvotes", order: "DESC" }}
    perPage={25}
    filters={filters}
    title="Questions"
  >
    <Datagrid bulkActionButtons={false}>
      <TextField source="content" label="Question" />
      <FunctionField
        label="Auteur"
        render={(record: any) => record.authorName || <em style={{ color: "#aaa" }}>Anonyme</em>}
      />
      <NumberField source="upvotes" label="👍 Votes" />
      <DateField source="createdAt" label="Posée le" showTime locales="fr-FR" />
      <TextField source="sessionId" label="Session ID" />
      <DeleteButton />
    </Datagrid>
  </List>
);

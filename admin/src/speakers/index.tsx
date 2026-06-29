import { useState, useEffect } from "react";
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
  useRecordContext,
  FunctionField,
} from "react-admin";

const filters = [<SearchInput key="q" source="q" alwaysOn />];

// Avatar small
const AvatarField = () => {
  const record = useRecordContext();
  if (!record) return null;
  return record.photoUrl ? (
    <img
      src={record.photoUrl}
      alt={record.fullName}
      style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
    />
  ) : (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#7c6ff7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      {record.fullName?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
};

export const SpeakerList = () => (
  <List
    sort={{ field: "fullName", order: "ASC" }}
    perPage={25}
    filters={filters}
    title="Intervenants"
  >
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <AvatarField />
      <TextField source="fullName" label="Nom complet" />
      <FunctionField
        label="Bio"
        render={(record: any) =>
          record.bio ? record.bio.slice(0, 80) + (record.bio.length > 80 ? "…" : "") : "—"
        }
      />
      <TextField source="slug" label="Slug" />
      <FunctionField
        label="Liens"
        render={(record: any) => {
          const links = record.links || [];
          return links.length > 0 ? `${links.length} lien(s)` : "—";
        }}
      />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// ─── Link editor ───
interface SpeakerLink {
  platform: string;
  label: string;
  url: string;
}

const PLATFORMS = ["twitter", "linkedin", "github", "youtube", "website", "other"];

function LinkEditor({
  links,
  setLinks,
}: {
  links: SpeakerLink[];
  setLinks: (l: SpeakerLink[]) => void;
}) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", margin: "16px 0 8px" }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#7c6ff7" }}>
          🔗 Liens externes
        </h4>
        <button
          type="button"
          onClick={() => setLinks([...links, { platform: "website", label: "", url: "" }])}
          style={{
            marginLeft: 12,
            padding: "3px 10px",
            fontSize: 12,
            background: "#7c6ff7",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          + Ajouter
        </button>
      </div>
      {links.map((link, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, width: "100%", flexWrap: "wrap" }}>
          <select
            value={link.platform}
            onChange={(e) => {
              const u = [...links];
              u[i].platform = e.target.value;
              setLinks(u);
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.23)",
              fontSize: 13,
              fontFamily: "inherit",
              background: "transparent",
              flex: "0 0 130px",
            }}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            placeholder="Label (optionnel)"
            value={link.label}
            onChange={(e) => {
              const u = [...links];
              u[i].label = e.target.value;
              setLinks(u);
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.23)",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              background: "transparent",
              flex: "1 1 100px",
            }}
          />
          <input
            placeholder="URL *"
            value={link.url}
            onChange={(e) => {
              const u = [...links];
              u[i].url = e.target.value;
              setLinks(u);
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.23)",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              background: "transparent",
              flex: "2 1 180px",
            }}
          />
          <button
            type="button"
            onClick={() => setLinks(links.filter((_, idx) => idx !== i))}
            style={{
              padding: "7px 11px",
              background: "#f07060",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Create ───
export const SpeakerCreate = () => {
  const [links, setLinks] = useState<SpeakerLink[]>([]);

  const transform = (data: any) => ({
    ...data,
    links: links.filter((l) => l.url.trim()),
  });

  return (
    <Create transform={transform} title="Créer un intervenant">
      <SimpleForm>
        <TextInput source="fullName" label="Nom complet" fullWidth required />
        <TextInput source="slug" label="Slug (URL)" fullWidth required helperText="Identifiant unique, ex: jean-dupont" />
        <TextInput source="bio" label="Biographie" multiline rows={4} fullWidth />
        <TextInput source="photoUrl" label="URL de la photo de profil" fullWidth />
        <ReferenceInput source="eventId" reference="events" required>
          <SelectInput optionText="title" label="Événement" fullWidth />
        </ReferenceInput>
        <LinkEditor links={links} setLinks={setLinks} />
      </SimpleForm>
    </Create>
  );
};

// ─── Edit ───
export const SpeakerEdit = () => {
  const [links, setLinks] = useState<SpeakerLink[] | null>(null);

  const transform = (data: any) => {
    const result: any = { ...data };
    if (links !== null) result.links = links.filter((l) => l.url.trim());
    return result;
  };

  return (
    <Edit
      title="Modifier l'intervenant"
      transform={transform}
      mutationMode="pessimistic"
    >
      <SimpleForm>
        <TextInput source="fullName" label="Nom complet" fullWidth required />
        <TextInput source="slug" label="Slug (URL)" fullWidth helperText="Identifiant unique dans les URLs publiques" />
        <TextInput source="bio" label="Biographie" multiline rows={4} fullWidth />
        <TextInput source="photoUrl" label="URL de la photo de profil" fullWidth />
        <LinksEditSection links={links} setLinks={setLinks} />
      </SimpleForm>
    </Edit>
  );
};

// Sub-component to access record in context for edit
function LinksEditSection({
  links,
  setLinks,
}: {
  links: SpeakerLink[] | null;
  setLinks: (l: SpeakerLink[]) => void;
}) {
  const record = useRecordContext();

  useEffect(() => {
    if (record?.links) {
      setLinks(
        (record.links as any[]).map((l: any) => ({
          platform: l.platform || "website",
          label: l.label || "",
          url: l.url || "",
        }))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.id]);

  if (!record) return null;

  return <LinkEditor links={links ?? []} setLinks={setLinks} />;
}

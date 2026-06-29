import { useState } from "react";
import { Create, SimpleForm, TextInput, DateTimeInput } from "react-admin";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.23)",
  background: "transparent",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

function SectionHeader({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "24px 0 8px", width: "100%" }}>
      <h3 style={{ color: "#7c6ff7", fontSize: 14, fontWeight: 700, margin: 0 }}>
        {label}
      </h3>
      <button
        type="button"
        onClick={onAdd}
        style={{
          marginLeft: 12,
          padding: "4px 12px",
          fontSize: 12,
          background: "#7c6ff7",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        + Ajouter
      </button>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 11px",
        background: "#f07060",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
        flexShrink: 0,
      }}
    >
      ✕
    </button>
  );
}

interface Speaker {
  fullName: string;
  bio: string;
  photoUrl: string;
}

interface Session {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  capacity: string;
  roomName: string;
  speakerNames: string;
}

export const EventCreate = () => {
  const [rooms, setRooms] = useState<string[]>([""]);
  const [speakers, setSpeakers] = useState<Speaker[]>([{ fullName: "", bio: "", photoUrl: "" }]);
  const [sessions, setSessions] = useState<Session[]>([
    { title: "", description: "", startsAt: "", endsAt: "", capacity: "", roomName: "", speakerNames: "" },
  ]);

  const transform = (data: any) => ({
    ...data,
    rooms: rooms.filter((r) => r.trim()),
    speakers: speakers.filter((s) => s.fullName.trim()),
    sessions: sessions
      .filter((s) => s.title.trim() && s.startsAt && s.endsAt)
      .map((s) => ({
        ...s,
        capacity: s.capacity ? parseInt(s.capacity) : null,
        speakerNames: s.speakerNames.split(",").map((n) => n.trim()).filter(Boolean),
      })),
  });

  return (
    <Create transform={transform} title="Créer un événement">
      <SimpleForm>
        {/* Event base info */}
        <TextInput source="title" label="Titre de l'événement" fullWidth required />
        <TextInput source="description" label="Description" multiline rows={3} fullWidth />
        <TextInput source="location" label="Lieu" fullWidth />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
          <DateTimeInput source="startsAt" label="Date et heure de début" required />
          <DateTimeInput source="endsAt" label="Date et heure de fin" required />
        </div>

        {/* Rooms */}
        <SectionHeader label="🏠 Salles" onAdd={() => setRooms([...rooms, ""])} />
        {rooms.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, width: "100%" }}>
            <input
              placeholder="Nom de la salle (ex : Amphi A)"
              value={r}
              onChange={(e) => {
                const u = [...rooms];
                u[i] = e.target.value;
                setRooms(u);
              }}
              style={{ ...fieldStyle, flex: 1 }}
            />
            {rooms.length > 1 && (
              <RemoveButton onClick={() => setRooms(rooms.filter((_, idx) => idx !== i))} />
            )}
          </div>
        ))}

        {/* Speakers */}
        <SectionHeader
          label="🎤 Intervenants"
          onAdd={() => setSpeakers([...speakers, { fullName: "", bio: "", photoUrl: "" }])}
        />
        {speakers.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, width: "100%", flexWrap: "wrap" }}>
            <input
              placeholder="Nom complet *"
              value={s.fullName}
              onChange={(e) => {
                const u = [...speakers];
                u[i].fullName = e.target.value;
                setSpeakers([...u]);
              }}
              style={{ ...fieldStyle, flex: "1 1 150px" }}
            />
            <input
              placeholder="Bio (optionnel)"
              value={s.bio}
              onChange={(e) => {
                const u = [...speakers];
                u[i].bio = e.target.value;
                setSpeakers([...u]);
              }}
              style={{ ...fieldStyle, flex: "2 1 200px" }}
            />
            <input
              placeholder="URL photo (optionnel)"
              value={s.photoUrl}
              onChange={(e) => {
                const u = [...speakers];
                u[i].photoUrl = e.target.value;
                setSpeakers([...u]);
              }}
              style={{ ...fieldStyle, flex: "1 1 150px" }}
            />
            {speakers.length > 1 && (
              <RemoveButton onClick={() => setSpeakers(speakers.filter((_, idx) => idx !== i))} />
            )}
          </div>
        ))}

        {/* Sessions */}
        <SectionHeader
          label="📅 Sessions"
          onAdd={() =>
            setSessions([
              ...sessions,
              { title: "", description: "", startsAt: "", endsAt: "", capacity: "", roomName: "", speakerNames: "" },
            ])
          }
        />
        {sessions.map((s, i) => (
          <div
            key={i}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 10,
              padding: 16,
              marginBottom: 12,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "#7c6ff7", fontSize: 13, fontWeight: 600 }}>
                Session {i + 1}
              </span>
              {sessions.length > 1 && (
                <RemoveButton onClick={() => setSessions(sessions.filter((_, idx) => idx !== i))} />
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {(
                [
                  ["Titre *", "title", "text"],
                  ["Salle (nom exact)", "roomName", "text"],
                  ["Début", "startsAt", "datetime-local"],
                  ["Fin", "endsAt", "datetime-local"],
                  ["Capacité (optionnel)", "capacity", "number"],
                  ["Intervenants (séparés par virgule)", "speakerNames", "text"],
                ] as const
              ).map(([placeholder, key, type]) => (
                <input
                  key={key}
                  type={type}
                  placeholder={placeholder}
                  value={s[key as keyof Session]}
                  onChange={(e) => {
                    const u = [...sessions];
                    (u[i] as any)[key] = e.target.value;
                    setSessions([...u]);
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.23)",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "inherit",
                    background: "transparent",
                    boxSizing: "border-box",
                  }}
                />
              ))}
            </div>
            <textarea
              placeholder="Description de la session"
              value={s.description}
              rows={2}
              onChange={(e) => {
                const u = [...sessions];
                u[i].description = e.target.value;
                setSessions([...u]);
              }}
              style={{
                width: "100%",
                marginTop: 8,
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid rgba(0,0,0,0.23)",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
                background: "transparent",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>
        ))}
      </SimpleForm>
    </Create>
  );
};

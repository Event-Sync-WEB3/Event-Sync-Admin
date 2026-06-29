import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import MicIcon from "@mui/icons-material/Mic";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Link } from "react-router-dom";
import { useDataProvider, Title } from "react-admin";

const StatCard = ({
  label,
  value,
  icon,
  to,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  to: string;
  color: string;
}) => (
  <Link to={to} style={{ textDecoration: "none", flex: "1 1 160px" }}>
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}22, ${color}11)`,
        border: `1px solid ${color}33`,
        borderRadius: 3,
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
      }}
    >
      <CardContent
        sx={{ display: "flex", alignItems: "center", gap: 2, p: "20px !important" }}
      >
        <div
          style={{
            background: color,
            borderRadius: 12,
            padding: 10,
            display: "flex",
            color: "white",
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{label}</div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

interface LiveSession {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  room?: { name: string };
}

export const Dashboard = () => {
  const dataProvider = useDataProvider();
  const [stats, setStats] = useState({ events: "-", sessions: "-", speakers: "-", rooms: "-" });
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [events, sessions, speakers, rooms] = await Promise.all([
          dataProvider.getList("events", { pagination: { page: 1, perPage: 1 }, sort: { field: "id", order: "ASC" }, filter: {} }),
          dataProvider.getList("sessions", { pagination: { page: 1, perPage: 1 }, sort: { field: "id", order: "ASC" }, filter: {} }),
          dataProvider.getList("speakers", { pagination: { page: 1, perPage: 1 }, sort: { field: "id", order: "ASC" }, filter: {} }),
          dataProvider.getList("rooms", { pagination: { page: 1, perPage: 1 }, sort: { field: "id", order: "ASC" }, filter: {} }),
        ]);
        setStats({
          events: String(events.total),
          sessions: String(sessions.total),
          speakers: String(speakers.total),
          rooms: String(rooms.total),
        });

        const allSessions = await dataProvider.getList("sessions", {
          pagination: { page: 1, perPage: 200 },
          sort: { field: "startsAt", order: "ASC" },
          filter: {},
        });
        const now = new Date();
        const live = allSessions.data.filter((s: any) => {
          const start = new Date(s.startsAt);
          const end = new Date(s.endsAt);
          return now >= start && now <= end;
        });
        setLiveSessions(live as LiveSession[]);

        const recentEvts = await dataProvider.getList("events", {
          pagination: { page: 1, perPage: 5 },
          sort: { field: "startsAt", order: "DESC" },
          filter: {},
        });
        setRecentEvents(recentEvts.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [dataProvider]);

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <Title title="Tableau de bord" />
      <h1 style={{ marginTop: 0, fontSize: 26, fontWeight: 700, color: "#111" }}>
        Tableau de bord
      </h1>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <StatCard label="Événements" value={stats.events} icon={<EventIcon />} to="/events" color="#7c6ff7" />
        <StatCard label="Sessions" value={stats.sessions} icon={<PeopleIcon />} to="/sessions" color="#3b82f6" />
        <StatCard label="Intervenants" value={stats.speakers} icon={<MicIcon />} to="/speakers" color="#10b981" />
        <StatCard label="Salles" value={stats.rooms} icon={<MeetingRoomIcon />} to="/rooms" color="#f59e0b" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Live sessions */}
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiberManualRecordIcon sx={{ color: "#ef4444", fontSize: 14 }} />
                <span style={{ fontSize: 16, fontWeight: 600 }}>Sessions en cours</span>
              </div>
            }
          />
          <CardContent>
            {liveSessions.length === 0 ? (
              <p style={{ color: "#888", margin: 0, fontSize: 14 }}>
                Aucune session en cours pour le moment.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {liveSessions.map((s) => (
                  <Link key={s.id} to={`/sessions/${s.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      padding: "12px 16px",
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#111", fontSize: 14 }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                          {s.room?.name ? `Salle : ${s.room.name} · ` : ""}
                          {new Date(s.startsAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          {" – "}
                          {new Date(s.endsAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <span style={{ background: "#ef4444", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: 0.5 }}>
                        LIVE
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent events */}
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader title={<span style={{ fontSize: 16, fontWeight: 600 }}>Événements récents</span>} />
          <CardContent>
            {recentEvents.length === 0 ? (
              <p style={{ color: "#888", margin: 0, fontSize: 14 }}>Aucun événement.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recentEvents.map((e) => (
                  <Link key={e.id} to={`/events/${e.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      padding: "12px 16px",
                      background: "#f8f7ff",
                      border: "1px solid #e0ddff",
                      borderRadius: 8,
                    }}>
                      <div style={{ fontWeight: 600, color: "#111", fontSize: 14 }}>{e.title}</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                        {e.location && `${e.location} · `}
                        {new Date(e.startsAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

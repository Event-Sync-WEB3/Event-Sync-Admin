import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { Dashboard } from "./dashboard";

// Resources
import { EventList, EventEdit, EventCreate } from "./events";
import { SessionList, SessionEdit, SessionCreate } from "./sessions";
import { SpeakerList, SpeakerEdit, SpeakerCreate } from "./speakers";
import { RoomList, RoomEdit, RoomCreate } from "./rooms";
import { QuestionList } from "./questions";

// Icons
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import MicIcon from "@mui/icons-material/Mic";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
    requireAuth
    title="EventSync Admin"
  >
    <Resource
      name="events"
      list={EventList}
      edit={EventEdit}
      create={EventCreate}
      icon={EventIcon}
      options={{ label: "Événements" }}
    />
    <Resource
      name="sessions"
      list={SessionList}
      edit={SessionEdit}
      create={SessionCreate}
      icon={PeopleIcon}
      options={{ label: "Sessions" }}
    />
    <Resource
      name="speakers"
      list={SpeakerList}
      edit={SpeakerEdit}
      create={SpeakerCreate}
      icon={MicIcon}
      options={{ label: "Intervenants" }}
    />
    <Resource
      name="rooms"
      list={RoomList}
      edit={RoomEdit}
      create={RoomCreate}
      icon={MeetingRoomIcon}
      options={{ label: "Salles" }}
    />
    <Resource
      name="questions"
      list={QuestionList}
      icon={QuestionAnswerIcon}
      options={{ label: "Questions" }}
    />
  </Admin>
);

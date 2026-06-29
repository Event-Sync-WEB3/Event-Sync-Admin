import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  Menu,
  usePermissions,
} from "react-admin";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import MicIcon from "@mui/icons-material/Mic";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const CustomMenu = () => (
  <Menu>
    <Menu.DashboardItem
      primaryText="Tableau de bord"
      leftIcon={<DashboardIcon />}
    />
    <Menu.Item
      to="/events"
      primaryText="Événements"
      leftIcon={<EventIcon />}
    />
    <Menu.Item
      to="/sessions"
      primaryText="Sessions"
      leftIcon={<PeopleIcon />}
    />
    <Menu.Item
      to="/speakers"
      primaryText="Intervenants"
      leftIcon={<MicIcon />}
    />
    <Menu.Item
      to="/rooms"
      primaryText="Salles"
      leftIcon={<MeetingRoomIcon />}
    />
    <Menu.Item
      to="/questions"
      primaryText="Questions"
      leftIcon={<QuestionAnswerIcon />}
    />
  </Menu>
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout menu={CustomMenu}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);

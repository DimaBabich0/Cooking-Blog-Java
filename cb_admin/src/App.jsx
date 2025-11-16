import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import UserCreatePage from "./pages/UserCreatePage.jsx";
import UserViewPage from "./pages/UserViewPage";
import UserEditPage from "./pages/UserEditPage";
import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UsersPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />
                <Route path="/users/:id" element={<UserViewPage />} />
                <Route path="/users/:id/edit" element={<UserEditPage />} />
            </Routes>
        </BrowserRouter>
    );
}
import HomePage from './containers/homePage.js';
import LoginPage from './containers/loginPage.js';
import RegisterPage from './containers/registerPage.js';
import AccountPage from './containers/accountPage.js';
import EventPage from './containers/eventPage.js';
import PastEventPage from './containers/pastEventPage.js';
import UserEventPage from './containers/userEventPage.js';
import BuildEventPage from './containers/buildEventPage.js';
import NavBar from './components/navBar.js';
import Footer from './components/footer.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
        <NavBar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/pastevents" element={<PastEventPage />} />
            <Route path="/newevent" element={<BuildEventPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/event" element={<UserEventPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

        </Routes>
        <Footer />
    </Router>
);
}

export default App;

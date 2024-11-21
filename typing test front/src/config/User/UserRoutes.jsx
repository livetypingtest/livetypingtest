import Blog from '../../component/feature/user/feature/Blog/Blog';
import BlogInner from '../../component/feature/user/feature/Blog/BlogInner';
import UserDashBoard from '../../component/feature/user/feature/dashboard/UserDashBoard';
import UserMatches from '../../component/shared/detailedMatches/UserMatches';
import LeaderBoard from '../../component/shared/leaderBoard/LeaderBoard';
import Lobby from '../../component/feature/user/feature/lobby/Lobby';
import TypingTestStats from '../../component/feature/user/feature/lobby/TypingTestStatistics';
import Signout from '../../component/shared/auth/Signout';
import About from '../../component/feature/user/feature/dynamicPages/About';
import Privacy_Policy from '../../component/feature/user/feature/dynamicPages/Privacy_Policy';
import Contact from '../../component/feature/user/feature/contact/Contact';
import Terms_Condition from '../../component/feature/user/feature/dynamicPages/Terms_Condition';

const userRoutes = [
    {
        path : 'dashboard',
        element : <UserDashBoard />
    },
    {
        path : '',
        element : <Lobby />
    },
    {
        path : 'stats',
        element : <TypingTestStats />
    },
    {
        path : 'leaderboard',
        element : <LeaderBoard />
    },
    {
        path : 'signout/:type',
        element : <Signout />
    },
    {
        path : 'matches/:level',
        element : <UserMatches />
    },
    {
        path : 'blog',
        element : <Blog />
    },
    {
        path : 'blog/:id',
        element : <BlogInner />
    },
    {
        path : 'about',
        element : <About />
    },
    {
        path : 'privacy',
        element : <Privacy_Policy />
    },
    {
        path : 'contact',
        element : <Contact />
    },
    {
        path : 'term-condition',
        element : <Terms_Condition />
    },
]

export default userRoutes
import AdminSignin from '../../component/feature/admin/feature/auth/AdminSignin'
import Lobby from '../../component/feature/user/feature/lobby/Lobby';
import TypingTestStats from '../../component/feature/user/feature/lobby/TypingTestStatistics';
import LeaderBoard from '../../component/shared/leaderBoard/LeaderBoard';
import Blog from '../../component/feature/user/feature/Blog/Blog';
import BlogInner from '../../component/feature/user/feature/Blog/BlogInner';
import Privacy_Policy from '../../component/feature/user/feature/dynamicPages/Privacy_Policy';
import About from '../../component/feature/user/feature/dynamicPages/About';
import Terms_Condition from '../../component/feature/user/feature/dynamicPages/Terms_Condition';
import Contact from '../../component/feature/user/feature/contact/Contact';


const rootRoutes = [
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
        path : 'blog',
        element : <Blog />
    },
    {
        path : 'blog/:id',
        element : <BlogInner />
    },
    {
        path : 'adminsignin',
        element : <AdminSignin />
    },
    {
        path : 'privacy',
        element : <Privacy_Policy />
    },
    {
        path : 'about',
        element : <About />
    },
    {
        path : 'term-condition',
        element : <Terms_Condition />
    },
    {
        path : 'contact',
        element : <Contact />
    },
]

export default rootRoutes;
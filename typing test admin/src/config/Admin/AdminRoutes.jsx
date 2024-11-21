import BlogEditor from '../../component/feature/blog/BlogEditor';
import BlogPage from '../../component/feature/blog/BlogPage';
import BlogView from '../../component/feature/blog/BlogView';
import AdminDashBoard from '../../component/feature/dashboard/AdminDashBoard'
import LeaderBoard from '../../component/shared/leaderBoard/LeaderBoard';
import Paragraphs from '../../component/feature/paragraphs/Paragraphs';
import AllUsers from '../../component/feature/users/allUsers/AllUsers';
import UserDetail from '../../component/feature/users/viewUsers/UserDetail';
import UserMatches from '../../component/shared/detailedMatches/UserMatches';
import Signout from '../../component/shared/auth/Signout';
import CreateUser from '../../component/feature/users/addUsers/CreateUser';
import Notification from '../../component/feature/notification/Notification';
import DynamicPages from '../../component/feature/dynamicPages/DynamicPages';
import Editor from '../../component/feature/dynamicPages/Editor';
import About from '../../component/feature/dynamicPages/About';
import AdminProfile from '../../component/feature/profile/AdminProfile';
import Contacts from '../../component/feature/contact/Contacts';
import DetailContact from '../../component/feature/contact/DetailContact';
import ManageAds from '../../component/feature/ADS/ManageAds';

const adminRoutes = [
    {
        path : '',
        element : <AdminDashBoard />
    },
    {
        path : 'users',
        element : <AllUsers />
    },
    {
        path : 'user/add',
        element : <CreateUser />
    },
    {
        path : 'leaderboard',
        element : <LeaderBoard />
    },
    {
        path : 'paragraphs',
        element : <Paragraphs />
    },
    {
        path : 'blog-add',
        element : <BlogEditor />
    },
    {
        path : 'blog-add/:id',
        element : <BlogEditor />
    },
    {
        path : 'blog',
        element : <BlogPage />
    },
    {
        path : 'blog/:id',
        element : <BlogView />
    },
    {
        path : 'users/:username',
        element : <UserDetail />
    },
    {
        path : 'users/matches/:level',
        element : <UserMatches />
    },
    {
        path : 'push-notification',
        element : <Notification />
    },
    {
        path : 'signout/:type',
        element : <Signout />
    },
    {
        path : 'pages',
        element : <DynamicPages  />
    },
    {
        path : 'about',
        element : <About  />
    },
    {
        path : 'contact',
        element : <Contacts  />
    },
    {
        path : 'contact/:id',
        element : <DetailContact  />
    },
    {
        path : 'profile',
        element : <AdminProfile  />
    },
    {
        path : 'ads',
        element : <ManageAds  />
    },
    {
        path : 'editor/:page',
        element : <Editor  />
    }
]

export default adminRoutes;
import { Routes, Route } from 'react-router-dom';

import IndexLayout from 'layouts/IndexLayout';
import MainLayout from 'layouts/MainLayout';
import UsersList from 'pages/users/List';
import UsersView from 'pages/users/View';
import UsersAdd from 'pages/users/Add';
import UsersEdit from 'pages/users/Edit';
import HomePage from './pages/home/HomePage';
import IndexPages from './pages/index';
import ErrorPages from './pages/errors';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'assets/styles/layout.scss';
const App = () => {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/home" element={<HomePage />} />
				

				{/* users pages routes */}
				<Route path="/users" element={<UsersList />} />
				<Route path="/users/:fieldName/:fieldValue" element={<UsersList />} />
				<Route path="/users/index/:fieldName/:fieldValue" element={<UsersList />} />
				<Route path="/users/view/:pageid" element={<UsersView />} />
				<Route path="/users/add" element={<UsersAdd />} />
				<Route path="/users/edit/:pageid" element={<UsersEdit />} />
			</Route>
			<Route exact element={<IndexLayout />}>
				<Route path="/*" element={<IndexPages />} />
				<Route path="/error/*" element={<ErrorPages />} />
			</Route>
		</Routes>
	);
}
export default App;

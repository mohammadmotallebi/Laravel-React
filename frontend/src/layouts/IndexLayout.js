import { Outlet } from 'react-router-dom';
import { $t } from 'i18n/index';
import { LangSwitcher } from 'components/LangSwitcher';
import { Link } from 'react-router-dom';

const IndexLayout = () => {
	
	const appName = process.env.REACT_APP_NAME;
	return (
		<div>
			<div className="layout-topbar  bg-primary shadow-7  ">
				<Link to="/" className="layout-topbar-logo">
						<img src="/images/logo.png" alt="logo" className="my-5" />
						<span className="text-white">{ appName }</span>

				</Link>
			</div>
			<div className="layout-main-container ">
				<div className="layout-main">
					<Outlet />
				</div>
	<div className="layout-footer justify-content-between align-items-center">
		<div className="mr-2">
			&copy; 2022 { appName }. {$t('allRightsReserved')}
		</div>
		<div>
			<span className="mr-2">{$t('language')}: </span>
			<LangSwitcher />
		</div>
	</div>

			</div>
		</div>
	);
}
export default IndexLayout;

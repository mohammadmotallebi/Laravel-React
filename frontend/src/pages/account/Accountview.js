import { $t } from 'i18n/index';
import { Menubar } from 'primereact/menubar';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import useApp from 'hooks/useApp';
import UsersEditPage from 'pages/users/Edit';

import useViewPage from 'hooks/useViewPage';
const UsersAccountviewPage = (props) => {
		const app = useApp();
	const pageController = useViewPage(props);
	const { item, pageReady, loading, apiRequestError, deleteItem } = pageController;
	function ActionButton(data){
		const items = [
		{
			label: $t('edit'),
			command: (event) => { app.openPageDialog(<UsersEditPage isSubPage apiPath={`/users/edit/${data.id}`} />, {closeBtn: true }) },
			icon: "pi pi-pencil"
		},
		{
			label: $t('delete'),
			command: (event) => { deleteItem(data.id) },
			icon: "pi pi-trash"
		}
	]
		return (<Menubar className="p-0 " model={items} />);
	}
	function PageFooter() {
		if (props.showFooter) {
			return (
				<div className="flex justify-content-between">
				</div>
			);
		}
	}
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}
	if(apiRequestError){
		return (
			<PageRequestError error={apiRequestError} />
		);
	}
	if(pageReady){
		return (
			<div>
<main id="UsersAccountviewPage" className="main-page">
    <section className="page-section " >
        <div className="container">
            <div className="grid ">
                <div className="col comp-grid" >
                    <div >
                        {/*PageComponentStart*/}
                        <div className="mb-3 grid justify-content-start">
                            <div className="col-12 md:col-4">
                                <div className="flex gap-3 align-items-center card p-3">
                                    <div className="">
                                        <div className="text-400 font-medium mb-1">{$t('firstName')}</div>
                                        <div className="font-bold">{ item.first_name }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex gap-3 align-items-center card p-3">
                                    <div className="">
                                        <div className="text-400 font-medium mb-1">{$t('lastName')}</div>
                                        <div className="font-bold">{ item.last_name }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex gap-3 align-items-center card p-3">
                                    <div className="">
                                        <div className="text-400 font-medium mb-1">{$t('pic')}</div>
                                        <div className="font-bold">{ item.pic }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex gap-3 align-items-center card p-3">
                                    <div className="">
                                        <div className="text-400 font-medium mb-1">{$t('id')}</div>
                                        <div className="font-bold">{ item.id }</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-content-between">
                            <div className="flex justify-content-start">
                                {ActionButton(item)}
                            </div>
                        </div>
                        {/*PageComponentEnd*/}
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
				<PageFooter />
			</div>
		);
	}
}
UsersAccountviewPage.defaultProps = {
	id: null,
	primaryKey: 'id',
	pageName: 'users',
	apiPath: 'account',
	routeName: 'usersaccountview',
	msgBeforeDelete: $t('promptDeleteRecord'),
	msgTitle: 'Delete Record',
	msgAfterDelete: $t('recordDeletedSuccessfully'),
	showHeader: true,
	showFooter: true,
	exportButton: true,
	isSubPage: false,
}
export default UsersAccountviewPage;

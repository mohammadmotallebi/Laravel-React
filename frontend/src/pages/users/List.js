import { $t } from 'i18n/index';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterTags } from 'components/FilterTags';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { PageRequestError } from 'components/PageRequestError';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SplitButton } from 'primereact/splitbutton';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useListPage from 'hooks/useListPage';
import useFilters from 'hooks/useFilters';
const UsersListPage = (props) => {
		const app = useApp();
	const filterSchema = {
		search: {
			tagTitle: $t('search'),
			value: '',
			valueType: 'single',
			options: [],
		}
	}
	const pageFilterController = useFilters(filterSchema);
	const pageController = useListPage(props, pageFilterController);
	const { records, pageReady, loading, selectedItems, sortBy, sortOrder, apiRequestError, setSelectedItems, getPageBreadCrumbs, onSort, deleteItem, pagination } = pageController;
	const { filters, setFilterValue } = pageFilterController;
	const { totalRecords, totalPages, recordsPosition, firstRow, limit, onPageChange } =  pagination;
	function ActionButton(data){
		const items = [
		{
			label: $t('view'),
			command: (event) => { app.navigate(`/users/view/${data.id}`) },
			icon: "pi pi-eye"
		},
		{
			label: $t('edit'),
			command: (event) => { app.navigate(`/users/edit/${data.id}`) },
			icon: "pi pi-pencil"
		},
		{
			label: $t('delete'),
			command: (event) => { deleteItem(data.id) },
			icon: "pi pi-trash"
		}
	]
		return (<SplitButton dropdownIcon="pi pi-bars" className="dropdown-only p-button-text p-button-plain" model={items} />);
	}
	function IdTemplate(data){
		if(data){
			return (
				<Link to={`/users/view/${data.id}`}> { data.id }</Link>
			);
		}
	}
	function PageLoading(){
		if(loading){
			return (
				<>
					<div className="flex align-items-center justify-content-center text-gray-500 p-3">
						<div><ProgressSpinner style={{width:'30px', height:'30px'}} /> </div>
						<div  className="font-bold text-lg">{$t('loading')}</div>
					</div>
				</>
			);
		}
	}
	function EmptyRecordMessage(){
		if(pageReady && !records.length){
			return (
				<div className="text-lg mt-3 p-3 text-center text-400 font-bold">
					{$t('noRecordFound')}
				</div>
			);
		}
	}
	function MultiDelete() {
		if (selectedItems.length) {
			return (
				<div className="m-2 flex-grow-0">
					<Button onClick={() => deleteItem(selectedItems)} icon="pi pi-trash" className="p-button-danger" title={$t('deleteSelected')}/>
				</div>
			)
		}
	}
	function PagerControl() {
		if (props.paginate && totalPages > 1) {
		const pagerReportTemplate = {
			layout: pagination.layout,
			CurrentPageReport: (options) => {
				return (
					<>
						<span className="text-sm text-gray-500 px-2">{$t('records')} <b>{ recordsPosition } {$t('of')} { options.totalRecords }</b></span>
					</>
				);
			}
		}
		return (
			<div className="flex-grow-1">
				<Paginator first={firstRow} rows={limit} totalRecords={totalRecords}  onPageChange={onPageChange} template={pagerReportTemplate} />
			</div>
		)
		}
	}
	function PageFooter() {
		if (pageReady && props.showFooter) {
			return (
				<div className="flex flex-wrap justify-content-between">
					<MultiDelete />
					<PagerControl />
				</div>
			);
		}
	}
	function PageBreadcrumbs(){
		if(props.showBreadcrumbs) {
			const items = getPageBreadCrumbs();
			return (items.length > 0 && <BreadCrumb className="mb-3" model={items} />);
		}
	}
	if(apiRequestError){
		return (
			<PageRequestError error={apiRequestError} />
		);
	}
	return (
<main id="UsersListPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container-fluid">
            <div className="grid justify-content-between align-items-center">
                <div className="col " >
                    <Title title={$t('users')}   titleClass="text-2xl text-primary font-bold" subTitleClass="text-sm text-500"      separator={false} />
                </div>
                <div className="col-12 md:col-3 " >
                    <Link to={`/users/add`}>
                        <Button label={$t('addNewUsers')} icon="pi pi-plus" type="button" className="p-button bg-primary "  />
                        </Link>
                    </div>
                    <div className="col-12 md:col-5 lg:col-4 " >
                        <span className="p-input-icon-left w-full">
                        <i className="pi pi-search" />
                        <InputText placeholder={$t('search')} className="w-full" value={filters.search.value}  onChange={(e) => setFilterValue('search', e.target.value)} />
                        </span>
                    </div>
                </div>
            </div>
        </section>
        }
        <section className="page-section " >
            <div className="container-fluid">
                <div className="grid ">
                    <div className="col comp-grid" >
                        <FilterTags filterController={pageFilterController} />
                        <div >
                            <PageBreadcrumbs />
                            <div className={`${!props.isSubPage ? 'card ' : ''}`}>
                                <div className="page-records">
                                    <DataTable 
                                        lazy={true} 
                                        loading={loading} 
                                        selectionMode="checkbox" selection={selectedItems} onSelectionChange={e => setSelectedItems(e.value)}
                                        value={records} 
                                        dataKey="id" 
                                        sortField={sortBy} 
                                        sortOrder={sortOrder} 
                                        onSort={onSort}
                                        className=" p-datatable-sm" 
                                        stripedRows={true}
                                        showGridlines={false} 
                                        rowHover={true} 
                                        responsiveLayout="stack" 
                                        emptyMessage={<EmptyRecordMessage />} 
                                        >
                                        {/*PageComponentStart*/}
                                        <Column selectionMode="multiple" headerStyle={{width: '2rem'}}></Column>
                                        <Column  field="id" header={$t('id')} body={IdTemplate}  ></Column>
                                        <Column  field="first_name" header={$t('firstName')}   ></Column>
                                        <Column  field="last_name" header={$t('lastName')}   ></Column>
                                        <Column  field="pic" header={$t('pic')}   ></Column>
                                        <Column headerStyle={{width: '2rem'}} headerClass="text-center" body={ActionButton}></Column>
                                        {/*PageComponentEnd*/}
                                    </DataTable>
                                </div>
                                <PageFooter />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
	);
}
UsersListPage.defaultProps = {
	primaryKey: 'id',
	pageName: 'users',
	apiPath: 'users/index',
	routeName: 'userslist',
	msgBeforeDelete: $t('promptDeleteRecord'),
	msgTitle: 'Delete Record',
	msgAfterDelete: $t('recordDeletedSuccessfully'),
	showHeader: true,
	showFooter: true,
	paginate: true,
	isSubPage: false,
	showBreadcrumbs: true,
	exportData: false,
	importData: false,
	keepRecords: false,
	multiCheckbox: true,
	search: '',
	fieldName: null,
	fieldValue: null,
	sortField: '',
	sortDir: '',
	pageNo: 1,
	limit: 10,
}
export default UsersListPage;

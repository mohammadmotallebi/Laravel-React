/**
 * @Category React hook function
 * List page hook. 
 * Provide list page state and functions
 * 
**/
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useQuery } from 'react-query';
import useUtils from 'hooks/useUtils';
import { confirmDialog } from 'primereact/confirmdialog';
import useApp from 'hooks/useApp';
import useApi from 'hooks/useApi';
const useListPage = (props, filters = {}) => {
	const app = useApp();
	const api = useApi();
	const utils = useUtils();
	const queryClient = useQueryClient();
	const [searchParams] = useSearchParams();
	const location = useLocation();
	let { fieldName, fieldValue } = useParams();
	if (props.fieldName) {
		fieldName = props.fieldName;
	}
	if (props.fieldValue) {
		fieldValue = props.fieldValue;
	}
	let currentSortBy = props.sortField;
	let currentSortType = props.sortDir;
	let pageNo = props.pageNo || 1;
	let pageLimit = props.limit || 10;
	/**
	 * when rendered as a sub page in another componet,
	 * use state passed via props when rendered in another page as sub page
	 * eg. of subpage <ProductsList isSubpage={true} orderby="category" page={1} limit={5}  />
	 * 
	 */
	if (!props.isSubPage) {
		currentSortBy = searchParams.get("orderby") || currentSortBy;
		currentSortType = searchParams.get("ordertype") || currentSortType;
		pageNo = parseInt(searchParams.get("page")) || pageNo;
		pageLimit = parseInt(searchParams.get("limit")) || pageLimit;
	}
	// compute current page offset
	const offset = useMemo(() => (pageNo - 1) * pageLimit, [pageNo, pageLimit]);
	const [firstRow, setFirstRow] = useState(offset);
	const [currentPage, setCurrentPage] = useState(pageNo);
	const [expandedRows, setExpandedRows] = useState(null);
	const [limit, setLimit] = useState(pageLimit);
	const [sortBy, setSortBy] = useState(currentSortBy);
	const [sortType, setSortType] = useState(currentSortType);
	const [sortOrder, setSortOrder] = useState(1);
	const [pageReady, setPageReady] = useState(false);
	const [singleSelect, setSingleSelect] = useState(true);
	const [selectedItems, setSelectedItems] = useState([]);
	const [records, setRecords] = useState([]);
	const [resetRecords, setResetRecords] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const [totalRecords, setTotalRecords] = useState(0);
	const [recordCount, setRecordCount] = useState(0);
	const filterParams = filters.filterParams;
	const filterParamStr = utils.serializeQuery(filterParams);
	const pageParams = { page: currentPage, limit };
	const apiUrl = useMemo(() => buildApiUrl(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[filterParams, limit, currentPage, sortBy, sortType, fieldName, fieldValue]
	);
	const cacheTime = (props.keepRecords ? 0 : 50000);
	const { isLoading, isError, data, error } = useQuery([props.pageName, apiUrl], () => fetchRecords(), { retry: false, cacheTime });
	// compute record  position
	const recordsPosition = useMemo(() => 
		Math.min(currentPage * limit, totalRecords), 
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentPage, limit]
	);
	// check if api has reached the last record
	const finishedLoading = (recordCount < limit && records.length > 0);
	// check if api has more data to fetch
	const canLoadMore = (!isLoading && !finishedLoading);
	useEffect(() => {
		setCurrentPage(pageNo);
		setLimit(pageLimit);
		setFirstRow(offset);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageNo, pageLimit]);
	// this effect runs when data from api changes
	useEffect(() => {
		function setPageData() {
			if (data) {
				if (data?.records) {
					if (props.keepRecords && !resetRecords) {
						setRecords([...records, ...data.records]);
					}
					else {
						setRecords(data.records);
					}
					setTotalPages(data?.totalPages);
					setTotalRecords(data?.totalRecords);
					setRecordCount(data?.recordCount);
					setResetRecords(false);
				}
				else {
					setRecords(data);
				}
				setPageReady(true);
			}
		}
		setPageData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isError]);
	//sync current pagination and filter state with url
	useEffect(() => {
		// if infinite load or  page is rendered as subpage, no need to sync state in url
		if (!props.isSubPage && !props.keepRecords) {
			const currentPageParams = Object.fromEntries(new URLSearchParams(location.search));
			const newParams = { ...currentPageParams, ...pageParams }
			if (filterParamStr) {
				newParams.filters = encodeURIComponent(JSON.stringify(filterParams));
			}
			else {
				delete newParams.filters;
			}
			//merge page current param with api param
			//let newUrl = location.pathname + '?' + utils.serializeQuery(newParams);
			//keep state in url
			//app.navigate(newUrl, { replace: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [apiUrl]);
	// reset pagination state when records filters change
	useEffect(() => {
		if (filterParamStr || fieldName || fieldValue) {
			resetPagination();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldName, fieldValue, filterParamStr]);
	// make axio request to the api
	function fetchRecords() {
		if (apiUrl) {
			return api.get(apiUrl).then((res) => res?.data);
		}
		return Promise.resolve(null);
	}
	//compute api url using current page state
	function buildApiUrl() {
		let path = props.apiPath;
		//when static filter is provided
		// example /products/index/category/toys
		if (fieldName) {
			path = path + '/' + encodeURIComponent(fieldName) + '/' + encodeURIComponent(fieldValue);
		}
		if (sortBy) {
			pageParams.orderby = sortBy;
			if (sortType) {
				pageParams.ordertype = sortType.toLowerCase();
			}
		}
		const queryString = utils.serializeQuery({ ...pageParams, ...filterParams });
		if (path.includes('?')) {
			return `${path}&${queryString}`;
		}
		return `${path}?${queryString}`;
	}
	function resetPagination() {
		if (pageReady && currentPage > 1) {
			setCurrentPage(1);
			setFirstRow(0);
		}
		setResetRecords(true); // set previous record to be cleared after fetch from api
	}
	//prime paginator component change event.
	function onPageChange(e) {
		setFirstRow(e.first);
		setLimit(e.rows);
		setCurrentPage(e.page + 1);
	}
	// set next page and trigger fetch from api
	function setPrevPage() {
		setCurrentPage(currentPage - 1);
	}
	// set next page and trigger fetch from api
	function setNextPage() {
		setCurrentPage(currentPage + 1);
	}
	//build breadcrum menu items based on current
	// breadcrum is build only on page static filters
	function getPageBreadCrumbs() {
		const items = [];
		const filterName = searchParams.get('tag') || fieldName;
		if (filterName) {
			items.push({
				label: filterName,
				icon: 'pi pi-home',
				command: () => app.navigate(`/${props.pageName}`)
			});
		}
		const filterValue = searchParams.get('label') || fieldValue;
		if (filterValue) {
			items.push({
				label: filterValue,
			});
		}
		return items;
	}
	//prime datatable component sort event
	function onSort(event) {
		if (event.sortField) {
			setSortBy(event.sortField);
			setSortOrder(event.sortOrder)
			if (sortType === 'asc') {
				setSortType('desc');
			}
			else {
				setSortType('asc');
			}
		}
	}
	function toggleSortType() {
		if (sortType === 'desc') {
			setSortType('asc');
		}
		else {
			setSortType('desc');
		}
	}
	//select record and set it as the master record
	function setCurrentRecord(record) {
		setSelectedItems([record]);
	}
	function expandRow(event) {
		const record = event.data;
		setExpandedRows(record);
	}
	// set the selected item as the current record.
	let currentRecord = null;
	if (selectedItems.length === 1) {
		currentRecord = selectedItems[0];
	}
	else {
		currentRecord = null;
	}
	//delete single item by id or selected records
	async function deleteItem(id) {
		if (id) {
			const newRecords = [...records];
			if (Array.isArray(id)) {
				id = id.map(value => value[props.primaryKey]);
			}
			else {
				id = [id];
			}
			let title = props.msgTitle;
			let prompt = props.msgBeforeDelete;
			confirmDialog({
				message: prompt,
				header: title,
				icon: 'pi pi-exclamation-triangle',
				accept: async () => {
					//callback to execute when user confirms the action
					try {
						id.forEach((itemId) => {
							let itemIndex = newRecords.findIndex(item => item[props.primaryKey] === itemId);
							if (itemIndex !== -1) {
								newRecords.splice(itemIndex, 1);
							}
						});
						setRecords(newRecords);
						const recid = encodeURIComponent(id.toString());
						const url = `${props.pageName}/delete/${recid}`;
						await api.get(url);
						queryClient.invalidateQueries(props.pageName);
						app.flashMsg(title, props.msgAfterDelete);
					}
					catch (err) {
						app.showPageRequestError(err);
					}
				},
				reject: () => {
					//callback to execute when user rejects the action
				}
			});
		}
	}
	const pagination = {
		totalRecords,
		canLoadMore,
		finishedLoading,
		totalPages,
		recordsPosition,
		recordCount,
		firstRow,
		currentPage,
		limit,
		onPageChange,
		setPrevPage,
		setNextPage,
		layout: 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
	}
	const page = {
		records,
		pageReady,
		loading: isLoading,
		singleSelect,
		selectedItems,
		apiRequestError: error,
		apiUrl,
		currentRecord,
		sortBy,
		sortType,
		sortOrder,
		expandedRows,
		expandRow,
		setSelectedItems,
		setSingleSelect,
		getPageBreadCrumbs,
		onSort,
		setSortBy,
		setSortType,
		toggleSortType,
		deleteItem,
		setCurrentRecord,
		pagination,
	}
	return useMemo(() => page,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[records, selectedItems, isLoading, pagination, error, fieldName, fieldValue, filters]
	);
}
export default useListPage;

import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import useUtils from 'hooks/useUtils';


const useFilters = (schema, debounceTime = 500) => {
	const utils = useUtils();
	const [searchParams] = useSearchParams();
	const filtersQueryParam = searchParams.get("filters");
	if(filtersQueryParam){
		const currentPageParams = JSON.parse(decodeURIComponent(filtersQueryParam));
		for (const [key, value] of Object.entries(currentPageParams)) {
			schema[key].value = value;
		}
	}

	const [filters, setFilters] = useState(schema);
	const [filterParams, setFilterParams] = useState({});

	function setFilterValue(field, value) {
		const filter = filters[field]
		filter.value = value;
		setFilters(prev => ({
			...prev,
			[field]: filter
		}));

	}

	function setFilterOptions(field, options) {
		const filter = filters[field]
		filter.options = options;
		setFilters(prev => ({
			...prev,
			[field]: filter
		}));
	}

	function computFilterValues() {
		const values = []
		for (const [key, filter] of Object.entries(filters)) {
			const value = filter.value || '';
			values.push(value.toString());
		}
		let v = values.join("");
		return v;
	}

	const filterValues = computFilterValues();

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			buildFilterParams();
		}, debounceTime);
		return () => clearTimeout(delayDebounceFn)
	}, [filterValues]);

	//build filter params from current filter state
	function buildFilterParams() {
		const query = {};
		for (const [key, filter] of Object.entries(filters)) {
			if (filterHasValue(key)) {
				if (filter.valueType === 'range') {
					query[key] = { min: filter.value[0], max: filter.value[1] };
				}
				else if (filter.valueType === 'range-date') {
					let fromDate = utils.formatDate(filter.value[0]);
					let toDate = utils.formatDate(filter.value[1]);
					query[key] = { from: fromDate, to: toDate };
				}
				else if (filter.valueType === 'multiple-date') {
					query[key] = filter.value.map((val) => utils.formatDate(val));
				}
				else {
					query[key] = filter.value;
				}
			}
		}
		setFilterParams(query)
	}

	function removeFilter(fieldname, selectedVal) {
		const filter = filters[fieldname];
		if (filter) {
			const valueType = filter.valueType;
			if (valueType == 'single') {
				filter.value = '';
			}
			else if (valueType === 'range') {
				filter.value = null;
			}
			else if (valueType === 'range-date') {
				filter.value = [];
			}
			else if (valueType === 'multiple' || valueType === 'multiple-date') {
				let idx = filter.value.indexOf(selectedVal);
				filter.value.splice(idx, 1);
			}
			setFilters(prev => ({
				...prev,
				[fieldname]: filter
			}));
		}
	}

	function filterHasValue(field) {
		const filter = filters[field];
		if (filter) {
			if (filter.valueType === 'range') {
				return filter?.value?.length > 0;
			}
			else if (filter.valueType === 'range-date') {
				const toDate = filter.value[1] || null;
				if (toDate) return true;//if second date is selected
				return false;
			}
			else if (Array.isArray(filter.value)) {
				return filter.value.length > 0;
			}
			else if (filter.value) {
				return true;
			}
		}
		return false;
	}

	function getFilterValue(filter, selectedVal) {
		if (filter) {
			if (filter.valueType === 'range' && filter.value.length) {
				let min = filter.value[0];
				let max = filter.value[1];
				return `${min} - ${max}`;
			}
			else if (filter.valueType === 'range-date' && filter.value.length) {
				let minDate = utils.humanDate(filter.value[0]);
				let maxDate = utils.humanDate(filter.value[1]);
				return `${minDate} - ${maxDate}`;
			}
			else if (filter.valueType === 'multiple-date') {
				let val = selectedVal || filter.value;
				return utils.humanDate(val);
			}
			else if (filter.valueType === 'single-date') {
				return utils.humanDate(filter.value);
			}
			else if (filter.options.length) {
				let val = selectedVal || filter.value;
				let selectedFilter = filter.options.find(obj => obj.value == val);
				if (selectedFilter) {
					return selectedFilter.label;
				}
			}
			else if (selectedVal) {
				return selectedVal.toString();
			}
			return filter.value;
		}
		return "";
	}
	return {
		filters,
		setFilterValue,
		setFilterOptions,
		removeFilter,
		filterHasValue,
		getFilterValue,
		filterParams
	}
}
export default useFilters
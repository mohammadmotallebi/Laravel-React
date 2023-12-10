
import React, { useState, useEffect } from 'react';

import useApi from './useApi';

function useApiQuery(apiPath) {
	const api = useApi();

	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState([]);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		if (apiPath) {
			try {
				setLoading(true);
				setError(false);
				const response = await api.get(apiPath);
				const result = response.data;
				setResponse(result);
			}
			catch (err) {
				console.error(err);
				setError(err);
			}
			finally {
				setLoading(false);
			}
		}
	}

	useEffect(() => {
		fetchData();
	}, [apiPath]);

	return [loading, response, error];
}
export default useApiQuery;
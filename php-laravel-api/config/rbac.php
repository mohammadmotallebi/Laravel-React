<?php
	return [

		"excluded_pages" => ["account", "component_data", "fileuploader"],

		"roles_permissions" => [
			
			"administrator" => [
				'app_logs/list', 'app_logs/view', 'app_logs/add', 'app_logs/edit', 'app_logs/delete', 'app_logs/import_data',

				'countries/list', 'countries/view', 'countries/add', 'countries/edit', 'countries/delete', 'countries/import_data',

				'departments/list', 'departments/view', 'departments/add', 'departments/edit', 'departments/delete', 'departments/import_data',

				'dependents/list', 'dependents/view', 'dependents/add', 'dependents/edit', 'dependents/delete', 'dependents/import_data',

				'employees/list', 'employees/view', 'employees/add', 'employees/edit', 'employees/delete', 'employees/import_data',

				'jobs/list', 'jobs/view', 'jobs/add', 'jobs/edit', 'jobs/delete', 'jobs/import_data',

				'locations/list', 'locations/view', 'locations/add', 'locations/edit', 'locations/delete', 'locations/import_data',

				'regions/list', 'regions/view', 'regions/add', 'regions/edit', 'regions/delete', 'regions/import_data',

				'role_permissions/list', 'role_permissions/view', 'role_permissions/add', 'role_permissions/edit', 'role_permissions/delete', 'role_permissions/import_data',

				'roles/list', 'roles/view', 'roles/add', 'roles/edit', 'roles/delete', 'roles/import_data',

				'users/list', 'users/view', 'users/add', 'users/edit', 'users/delete', 'users/import_data', 'users/userregister', 'users/accountedit', 'users/accountview',

				'nicelist/list'
			],
			
			
			"user" => [
				'users/userregister', 'users/accountedit', 'users/accountview',

				'nicelist/list'
			],
			
			
		]
	];

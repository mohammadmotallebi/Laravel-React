<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
/**
 * Components Data Contoller
 * Use for getting values from the database for page components
 * Support raw query builder
 * @category Controller
 */
class Components_dataController extends Controller{
	
	/**
     * check if email value already exist in Users
	 * @param string $value
     * @return bool
     */
	function users_email_exist(Request $request, $value){
		$exist = DB::table('users')->where('email', $value)->value('email');   
		if($exist){
			return "true";
		}
		return "false";
	}
}

<?php
namespace App\Http\Middleware;
use Illuminate\Http\Request;
use Closure;
class AccountStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
		$user = auth()->user();
        if($user) {
			$accountStatus = strtolower($user['account_status']);
			if($accountStatus != "active"){
				$nextpage = "index/account$accountStatus";
			    return response(["nextpage" => $nextpage], 403);
			}
        }
        return $next($request);
    }
}
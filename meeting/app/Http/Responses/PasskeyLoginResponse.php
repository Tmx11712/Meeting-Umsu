<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Fortify;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse as PasskeyLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class PasskeyLoginResponse implements PasskeyLoginResponseContract
{
    public function toResponse($request): Response
    {
        $redirect = Fortify::redirects('login');

        $user = $request->user();
        if ($user && $team = ($user->currentTeam ?? $user->personalTeam())) {
            $redirectUrl = route('dashboard', ['current_team' => $team->slug]);
        } else {
            $redirectUrl = redirect()->intended($redirect)->getTargetUrl();
        }

        return $request->wantsJson()
            ? new JsonResponse(['redirect' => $redirectUrl], 200)
            : redirect()->intended($redirectUrl);
    }
}

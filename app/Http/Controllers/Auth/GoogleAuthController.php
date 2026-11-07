<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Teams\CreateTeam;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Throwable;

class GoogleAuthController extends Controller
{
    public function __construct(private CreateTeam $createTeam) {}

    public function redirect(): RedirectResponse|\Symfony\Component\HttpFoundation\RedirectResponse
    {
        /** @var GoogleProvider $driver */
        $driver = Socialite::driver('google');

        return $driver->redirectUrl(url('/auth/google/callback'))->stateless()->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        try {
            /** @var GoogleProvider $driver */
            $driver = Socialite::driver('google');
            $googleUser = $driver->redirectUrl(url('/auth/google/callback'))->stateless()->user();
        } catch (Throwable $e) {
            Log::error('Google Auth callback failed: '.$e->getMessage(), ['exception' => $e]);

            return redirect()->route('login')->withErrors([
                'email' => 'Gagal masuk dengan Google. Silakan coba lagi.',
            ]);
        }

        $email = strtolower((string) $googleUser->getEmail());

        if ($email === '') {
            return redirect()->route('login')->withErrors([
                'email' => 'Akun Google tidak memiliki alamat email yang valid.',
            ]);
        }

        $user = User::query()
            ->where('google_id', '=', $googleUser->getId())
            ->orWhere('email', '=', $email)
            ->first();

        if ($user) {
            if (($user->status ?? 'aktif') === 'nonaktif') {
                return redirect()->route('login')->withErrors([
                    'email' => 'Akun Anda sedang dinonaktifkan.',
                ]);
            }

            $user->forceFill([
                'google_id' => $user->google_id ?? $googleUser->getId(),
                'email_verified_at' => $user->email_verified_at ?? now(),
            ])->save();
        } else {
            $user = DB::transaction(function () use ($googleUser, $email): User {
                $name = trim((string) ($googleUser->getName() ?: explode('@', $email)[0]));
                $initials = strtoupper(collect(explode(' ', $name))->filter()->map(fn (string $w) => $w[0])->take(2)->join(''));

                $newUser = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleUser->getId(),
                    'initials' => $initials ?: 'U',
                    'status' => 'aktif',
                    'email_verified_at' => now(),
                    'password' => Str::random(32),
                ]);

                $this->createTeam->handle($newUser, $newUser->name."'s Team", isPersonal: true);

                $defaultRole = Role::query()->where('name', '=', 'Viewer')->first();
                if ($defaultRole) {
                    $newUser->assignRole($defaultRole);
                }

                return $newUser;
            });
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->intended(config('fortify.home', '/dashboard'));
    }
}

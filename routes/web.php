<?php

use App\Http\Controllers\Api\User\VerifyEmailController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::any('webhooks/{service}/{type?}', function (Request $request, string $service, ?string $type = null) {
    try {
        \App\Models\Webhook::create(['service' => $service, 'type' => $type, 'payload' => $request->all()]);

        return response()->json('ok');
    } catch (\Exception $e) {
        \Log::error('Webhook error: '.$service.' Message: '.$e->getMessage().' Payload: '.json_encode($request->all()));
        \App\Models\LogErrors::create([
            'type' => "webhook_{$service}_{$type}",
            'errors' => $e->getMessage(),
            'user_id' => $request->user()?->id,
        ]);

        return response()->json('ok');
    }
});

Route::get('auth/password/reset', function () {
    return redirect('/reset-password')->with([
        'email' => request()->email,
        'token' => request()->token,
    ]);
})->name('password.reset');

Route::post('verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth:sanctum', 'signed'/*, 'throttle:6,1'*/])
    ->name('verification.verify');

Route::get('/verify-email', function () {
    return view('application');
})->name('verification.notice');

Route::get('verify-email/{id}/{hash}', fn () => view('application'))->name('verification.verify');

Route::get('{any?}', function () {
    return view('application');
})->where('any', '.*');

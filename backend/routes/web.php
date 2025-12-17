<?php

use Illuminate\Support\Facades\Route;
use Google\Client as GoogleClient;
Route::get('/', function () {
    return view('welcome');
});
Route::get('/auth/google', function () {
    $client = new GoogleClient();
    $client->setAuthConfig(config('services.google.drive'));
    $client->addScope(\Google\Service\Drive::DRIVE_FILE);
    $client->setRedirectUri(route('google.callback'));
    $client->setAccessType('offline');
    $client->setPrompt('consent');
    
    $authUrl = $client->createAuthUrl();
    return redirect($authUrl);
});

Route::get('/auth/google/callback', function (Request $request) {
    $client = new GoogleClient();
    $client->setAuthConfig(config('services.google.drive'));
    $client->addScope(\Google\Service\Drive::DRIVE_FILE);
    $client->setRedirectUri(route('google.callback'));
    
    $token = $client->fetchAccessTokenWithAuthCode($request->code);
    
    // Guarda el refresh token
    $refreshToken = $token['refresh_token'] ?? null;
    
    return "Refresh Token: " . $refreshToken;
})->name('google.callback');
<?php

use Google\Client;
use Google\Service\Drive;
use Illuminate\Http\Request;

class GoogleDriveController extends Controller
{
    private function getClient()
    {
        $client = new Client();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->addScope(Drive::DRIVE);
        $client->setAccessType('offline');
        $client->setPrompt('select_account consent');

        return $client;
    }

    public function redirect()
    {
        $client = $this->getClient();
        return redirect($client->createAuthUrl());
    }

    public function callback(Request $request)
    {
        $client = $this->getClient();
        $token = $client->fetchAccessTokenWithAuthCode($request->code);

        session(['google_token' => $token]);

        return redirect('/drive');
    }

    public function listFiles()
    {
        $client = $this->getClient();
        $client->setAccessToken(session('google_token'));

        $service = new Drive($client);
        $files = $service->files->listFiles([
            'pageSize' => 10,
            'fields' => 'files(id, name)'
        ]);

        return response()->json($files->getFiles());
    }
}

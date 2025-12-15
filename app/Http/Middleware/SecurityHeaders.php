<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (method_exists($response, 'header')) {
            
            $isLocal = app()->environment('local', 'testing');

            // IZINKAN SEMUA SCRIPT DI LOKAL
            $scriptSrc = $isLocal 
                ? "* 'unsafe-inline' 'unsafe-eval'" 
                : "'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com";

            // IZINKAN WS (WEBSOCKET) UNTUK VITE
            $connectSrc = $isLocal
                ? "* ws: wss:" 
                : "'self' https://maps.googleapis.com";

            // PERBAIKAN UTAMA DI SINI (FRAME-SRC)
            // Kita izinkan 'https:' secara global untuk frame agar map tidak diblokir
            $csp = "default-src 'self'; " .
                   "script-src $scriptSrc; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net; " .
                   "img-src 'self' data: blob: https:; " . // Izinkan semua gambar HTTPS
                   "font-src 'self' data: https://fonts.gstatic.com https://fonts.bunny.net; " .
                   "connect-src $connectSrc; " .
                   "frame-src 'self' https: http:;"; // <-- BOLEHKAN SEMUA IFRAME HTTPS/HTTP

            $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
            $response->headers->set('X-Content-Type-Options', 'nosniff');
            $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
            $response->headers->set('Content-Security-Policy', $csp);
            $response->headers->set('Permissions-Policy', 'geolocation=(self), microphone=()');
        }

        return $response;
    }
}
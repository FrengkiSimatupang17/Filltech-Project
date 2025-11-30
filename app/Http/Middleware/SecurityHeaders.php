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

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // CSP Configuration
        // Kita izinkan 'unsafe-inline' untuk style karena Vite/Tailwind membutuhkannya.
        // Kita izinkan fonts.bunny.net untuk font.
        // Kita izinkan data: dan blob: untuk gambar (preview upload).
        
        $csp = "default-src 'self'; " .
               "script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https:; " .
               "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; " .
               "font-src 'self' data: https://fonts.bunny.net; " .
               "img-src 'self' data: blob: https:; " .
               "connect-src 'self' http: https: ws: wss:;";

        $response->headers->set('Content-Security-Policy', $csp);

        if (app()->isProduction()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
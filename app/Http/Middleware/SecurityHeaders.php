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

        // 1. Header Keamanan Standar (Anti-Clickjacking, MIME-Sniffing, XSS)
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // 2. Content Security Policy (CSP) - Dinamis berdasarkan Environment
        if (app()->isLocal()) {
            // --- MODE DEVELOPMENT (Lokal) ---
            // Kita izinkan skema http: dan ws: secara luas agar Vite (localhost/[::1]) tidak terblokir.
            // Ini solusi paling stabil untuk mengatasi error sintaks IPv6 di Chrome.
            $csp = "default-src 'self'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https:; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; " .
                   "img-src 'self' data: blob: https:; " .
                   "font-src 'self' data: https://fonts.bunny.net; " .
                   "connect-src 'self' http: https: ws: wss:;";
        } else {
            // --- MODE PRODUCTION (Live) ---
            // Aturan ketat: Hanya izinkan self dan domain terpercaya.
            $csp = "default-src 'self'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; " .
                   "img-src 'self' data: blob:; " .
                   "font-src 'self' data: https://fonts.bunny.net; " .
                   "connect-src 'self';";
        }

        $response->headers->set('Content-Security-Policy', $csp);

        // 3. Strict Transport Security (HSTS) - Hanya aktif di Production
        if (app()->isProduction()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
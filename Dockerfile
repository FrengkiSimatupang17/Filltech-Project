# 1. Gunakan Image PHP 8.2 dengan Apache
FROM php:8.2-apache

# 2. Install dependensi sistem + Library GD & ZIP (Wajib untuk Excel)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql gd zip

# 3. Aktifkan mod_rewrite Apache (Wajib untuk Laravel Routing)
RUN a2enmod rewrite

# 4. KONFIGURASI APACHE KHUSUS LARAVEL [BAGIAN PENTING YANG BARU]
# Kita memaksa Apache mengizinkan .htaccess agar /login tidak 404
RUN echo '<Directory /var/www/html/public>' > /etc/apache2/conf-available/laravel.conf && \
    echo '    Options Indexes FollowSymLinks' >> /etc/apache2/conf-available/laravel.conf && \
    echo '    AllowOverride All' >> /etc/apache2/conf-available/laravel.conf && \
    echo '    Require all granted' >> /etc/apache2/conf-available/laravel.conf && \
    echo '</Directory>' >> /etc/apache2/conf-available/laravel.conf && \
    a2enconf laravel

# 5. Atur Document Root ke folder /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# 6. Copy semua file proyek ke dalam container
COPY . /var/www/html

# 7. Install Dependensi PHP (Composer)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# 8. Install Dependensi JS & Build Frontend (Inertia/React)
RUN npm install
RUN npm run build

# 9. Atur hak akses folder storage agar bisa ditulis
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 10. Port yang dibuka
EXPOSE 80
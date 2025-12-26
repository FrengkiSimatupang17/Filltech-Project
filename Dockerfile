# 1. Gunakan Image PHP 8.2 dengan Apache
FROM php:8.2-apache

# 2. Install dependensi sistem yang dibutuhkan
# [FIX] Ditambahkan: libpng-dev, libjpeg-dev, libfreetype6-dev untuk GD Extension
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    unzip \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql gd

# 3. Aktifkan mod_rewrite Apache (Wajib untuk Laravel)
RUN a2enmod rewrite

# 4. Atur Document Root ke folder /public (Standar Laravel)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# 5. Copy semua file proyek ke dalam container
COPY . /var/www/html

# 6. Install Dependensi PHP (Composer)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# 7. Install Dependensi JS & Build Frontend (Inertia/React)
RUN npm install
RUN npm run build

# 8. Atur hak akses folder storage agar bisa ditulis
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Port yang dibuka
EXPOSE 80
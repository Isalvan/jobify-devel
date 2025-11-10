# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Install system dependencies for Laravel
RUN apt-get update && apt-get install -y \
    git zip unzip curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && a2enmod rewrite

# Install Composer globally
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory inside container
WORKDIR /var/www/html

# Copy app files
COPY . .

# Install Laravel dependencies
RUN composer install

# Expose port 80 (Apache)
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]

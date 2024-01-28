# 📋 PHP Realtime Clipboard

<img src="https://www.php.net/images/logos/php-logo.svg" alt="PHP Logo" width="50" height="50" style="margin-right: 20px;">

<img src="https://mariadb.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2019/11/mariadb-logo_black-transparent-300x75.png.webp" alt="MariaDB Logo" height="40" style="margin-right: 20px;">

<img src="https://www.mysql.com/common/logos/logo-mysql-170x115.png" alt="MySQL Logo" height="40">


## Overview

Create and share your clipboards in real-time hassle-free! This PHP application generates a unique user ID for each user, eliminating the need for login or account creation. Users can effortlessly manage their clipboards by providing the unique user ID.

## Features

- Real-time clipboard creation and sharing.
- Automatic generation of unique user IDs.
- No login or account creation required.
- Seamless access to all clipboards using the user ID.

## Installation

### Prerequisites

- PHP installed on your server.
- A MySQL database.
- Git for cloning the repository.

### Steps

1. **Clone the GitHub Repository:**

    ```bash
    git clone https://github.com/codeterrayt/Realtime-Clipboard.git
    ```

2. **Import the SQL File:**

    - Use a MySQL client to import the `realtime_clipboard_table.sql` file into your database.

        ```bash
        mysql -u username -p realtime_clipboard_db < realtime_clipboard_table.sql
        ```

3. **Configure your Web Server:**

    - Make sure your web server is configured to serve the `index.php` file.

4. **Run the Application:**

    - Open your browser and navigate to `http://yourdomain.com` to start using the Realtime Clipboard.

## Usage

1. **Create a Clipboard:**

    - Visit the application and create a new clipboard.

2. **Get Unique User ID:**

    - Your unique user ID will be generated automatically.

3. **Access Clipboard:**

    - Use the unique user ID to access your all clipboard anytime.

4. **Share Clipboard:**

    - Share the clipboard link with others for real-time updates.

## File Structure

- `index.php`: Main application file.
- `realtime_clipboard_table.sql`: SQL file for database setup.

## Notes

- This application is designed for passwordless access for user convenience.
- The unique user ID serves as the key to access all clipboards.
- Ensure proper security measures before deploying in a production environment.

🚀 Happy Clipboarding! 📎

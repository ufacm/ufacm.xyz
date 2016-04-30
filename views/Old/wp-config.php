<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link https://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress10');
define('FS_METHOD', 'direct');

/** MySQL database username */
define('DB_USER', 'webmaster');

/** MySQL database password */
define('DB_PASSWORD', 'ufacmwebmaster');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '}0h<a0[8c AKpgz0<AQK+0nI;=DIu_0vG0MH0P]_kDIwx.pWM7}^+2A/Q6lV$I*o');
define('SECURE_AUTH_KEY',  '}> p}+5m}gisFY[s5h1^UY.}2W(M/>G}2pf>b^d!js;UJr1|pW/0!/9.CG>{-Eqg');
define('LOGGED_IN_KEY',    '9Mv;d|;~T1^<GOmq?zAd`.t4J23tqaL4>D@9+p{/_4<Co|z,.;B*YgrEix~du}l+');
define('NONCE_KEY',        '*h#Q0A2~nQMQeE>lmi}S!x <Sp:,o/d#4uK&4*QC$  A)>nC-3FC2j+T0!{vj[rT');
define('AUTH_SALT',        'J1]b:%>+p ri1B^|=FV6yodHxqY^{{=]=OTC|]7#WnCr1PQN)_f|K+Y+8g*~SqUh');
define('SECURE_AUTH_SALT', '54!Zz[=wLR- nEnORC_F9UV{nr@x%KzKUZjZ#`rqE?|ZJYcM9 r6[U~:A[[7DGYI');
define('LOGGED_IN_SALT',   'm&Lj+=::c,:,{m?e9[|{.B,CpG++P=MKI<+<Ux&w6VF!(X`O-bi))iV83ac_9?4X');
define('NONCE_SALT',       'aH4#9q;YbNQM|EWF[-,G,X|d)PajY3V<x|Gx.b,1DAlw848<6K(`LFegR$|{:5D&');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_acm';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

define('WP_HOME','http://acm.cise.ufl.edu');
define('WP_SITEURL','http://acm.cise.ufl.edu');

@echo off
REM ================================================================
REM BotWA Pro - Crear estructura en Windows
REM Doble clic para ejecutar o: setup.bat en CMD
REM ================================================================

echo Creando estructura BotWA Pro...

REM ================================================================
REM CARPETAS
REM ================================================================
mkdir assets\css
mkdir assets\js
mkdir assets\img\hero
mkdir assets\img\icons
mkdir assets\img\pagos
mkdir assets\img\testimonios
mkdir assets\img\team
mkdir assets\img\blog
mkdir assets\fonts\Syne
mkdir assets\fonts\SpaceMono
mkdir auth
mkdir cliente
mkdir admin
mkdir checkout
mkdir api\config
mkdir api\v1
mkdir api\models
mkdir api\controllers
mkdir api\middleware
mkdir api\helpers
mkdir database\migrations
mkdir database\seeds
mkdir webhooks
mkdir cron
mkdir storage\uploads\avatars
mkdir storage\uploads\tickets
mkdir storage\uploads\documentos
mkdir storage\invoices
mkdir storage\backups
mkdir storage\cache
mkdir storage\logs
mkdir docs

REM ================================================================
REM ARCHIVOS RAIZ
REM ================================================================
type nul > index.html
type nul > planes.html
type nul > servicios.html
type nul > soporte.html
type nul > contacto.html
type nul > nosotros.html
type nul > blog.html
type nul > testimonios.html
type nul > faq.html
type nul > afiliados.html
type nul > comparativa.html
type nul > demo.html
type nul > ofertas.html
type nul > gracias.html
type nul > terminos.html
type nul > privacidad.html
type nul > reembolso.html
type nul > cookies.html
type nul > .htaccess
type nul > .env.example
type nul > .gitignore
type nul > robots.txt
type nul > sitemap.xml
type nul > README.md

REM ================================================================
REM ASSETS CSS
REM ================================================================
type nul > assets\css\style.css
type nul > assets\css\responsive.css
type nul > assets\css\auth.css
type nul > assets\css\cliente.css
type nul > assets\css\admin.css
type nul > assets\css\planes.css
type nul > assets\css\checkout.css
type nul > assets\css\animations.css

REM ================================================================
REM ASSETS JS
REM ================================================================
type nul > assets\js\main.js
type nul > assets\js\api.js
type nul > assets\js\auth.js
type nul > assets\js\admin.js
type nul > assets\js\cliente.js
type nul > assets\js\planes.js
type nul > assets\js\checkout.js
type nul > assets\js\validation.js
type nul > assets\js\payment.js

REM ================================================================
REM AUTH
REM ================================================================
type nul > auth\login.html
type nul > auth\registro.html
type nul > auth\recuperar-password.html

REM ================================================================
REM CLIENTE PANEL
REM ================================================================
type nul > cliente\dashboard.html
type nul > cliente\mis-bots.html
type nul > cliente\tickets.html
type nul > cliente\facturas.html
type nul > cliente\perfil.html
type nul > cliente\seguridad.html

REM ================================================================
REM ADMIN PANEL
REM ================================================================
type nul > admin\dashboard.html
type nul > admin\usuarios.html
type nul > admin\bots.html
type nul > admin\pagos.html
type nul > admin\tickets.html
type nul > admin\planes.html
type nul > admin\mensajes.html
type nul > admin\configuracion.html
type nul > admin\login.html

REM ================================================================
REM CHECKOUT
REM ================================================================
type nul > checkout\carrito.html
type nul > checkout\datos-facturacion.html
type nul > checkout\metodo-pago.html
type nul > checkout\confirmar-orden.html

REM ================================================================
REM API CONFIG
REM ================================================================
type nul > api\config\database.php
type nul > api\config\config.php
type nul > api\config\cors.php

REM ================================================================
REM API V1 ENDPOINTS
REM ================================================================
type nul > api\v1\auth.php
type nul > api\v1\users.php
type nul > api\v1\plans.php
type nul > api\v1\bots.php
type nul > api\v1\payments.php
type nul > api\v1\invoices.php
type nul > api\v1\tickets.php
type nul > api\v1\stats.php

REM ================================================================
REM API MODELS
REM ================================================================
type nul > api\models\User.php
type nul > api\models\Plan.php
type nul > api\models\Bot.php
type nul > api\models\Payment.php
type nul > api\models\Invoice.php
type nul > api\models\Ticket.php

REM ================================================================
REM API CONTROLLERS
REM ================================================================
type nul > api\controllers\AuthController.php
type nul > api\controllers\UserController.php
type nul > api\controllers\PlanController.php
type nul > api\controllers\BotController.php
type nul > api\controllers\PaymentController.php
type nul > api\controllers\TicketController.php

REM ================================================================
REM API MIDDLEWARE
REM ================================================================
type nul > api\middleware\AuthMiddleware.php
type nul > api\middleware\AdminMiddleware.php
type nul > api\middleware\CorsMiddleware.php

REM ================================================================
REM API HELPERS
REM ================================================================
type nul > api\helpers\functions.php
type nul > api\helpers\validation.php
type nul > api\helpers\security.php

REM ================================================================
REM DATABASE
REM ================================================================
type nul > database\botwa.sql
type nul > database\migrations\001_users.sql
type nul > database\migrations\002_plans.sql
type nul > database\migrations\003_bots.sql
type nul > database\migrations\004_payments.sql
type nul > database\migrations\005_invoices.sql
type nul > database\migrations\006_tickets.sql
type nul > database\migrations\007_stats.sql
type nul > database\seeds\admin_user.sql
type nul > database\seeds\plans_data.sql
type nul > database\seeds\settings_data.sql

REM ================================================================
REM WEBHOOKS
REM ================================================================
type nul > webhooks\stripe.php
type nul > webhooks\paypal.php
type nul > webhooks\whatsapp.php

REM ================================================================
REM CRON JOBS
REM ================================================================
type nul > cron\check-renewals.php
type nul > cron\send-reminders.php
type nul > cron\process-payments.php
type nul > cron\backup-database.php

REM ================================================================
REM STORAGE LOGS
REM ================================================================
type nul > storage\logs\app.log
type nul > storage\logs\error.log
type nul > storage\logs\payment.log

REM ================================================================
REM DOCS
REM ================================================================
type nul > docs\api-documentation.md
type nul > docs\instalacion.md
type nul > docs\configuracion.md

echo.
echo ============================================
echo   BotWA Pro - Estructura creada con exito
echo ============================================
echo.
pause
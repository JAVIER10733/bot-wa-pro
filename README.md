# BotWA Pro - Infraestructura para WhatsApp Business 🚀

BotWA Pro es una solución líder en Ecuador para la automatización y gestión de WhatsApp Business a escala. Ofrecemos servidores optimizados y preconfigurados para desarrolladores y empresas que buscan estabilidad, velocidad y soporte técnico especializado.

## 🚀 Características Principales

- **Multi-Dispositivo**: Soporte para conectar hasta 4 dispositivos simultáneamente.
- **APIs Listas para Usar**: Compatible con Baileys, WPPConnect, Venom, y más.
- **Anti-Bloqueo**: IPs limpias y rotación inteligente para proteger tu número.
- **Uptime 99.9%**: Infraestructura redundante monitoreada 24/7.
- **Soporte en Español**: Soporte técnico directo vía WhatsApp desde Ecuador.

## 🛠️ Requisitos Técnicos

- Node.js v16+ (Recomendado v18 o v20 LTS)
- PHP 8.1+ (Para el panel administrativo y API)
- MySQL/MariaDB 10.4+
- Servidor Web (Apache/Nginx)
- SSL Certificado (Let's Encrypt recomendado)

## 📁 Estructura del Proyecto

- `/api`: Backend en PHP para gestión de usuarios, roles y facturación.
- `/admin`: Panel de control administrativo.
- `/cliente`: Área de clientes para gestión de instancias.
- `/assets`: Recursos estáticos (CSS, JS, Imágenes).
- `/database`: Scripts de migración y esquema SQL.

## ⚙️ Instalación Rápida

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/BotWA-Pro.git
   ```
2. Configura el entorno:
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales de base de datos y JWT
   ```
3. Importa la base de datos:
   ```bash
   mysql -u root -p botwa_pro < database/schema.sql
   ```
4. Instala dependencias (si aplica):
   ```bash
   npm install
   ```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
© 2025 **BotWA Pro** - Guayaquil, Ecuador.

# Laniakea 🚀

Laniakea es una superplataforma diseñada para centralizar, impulsar y optimizar campañas en redes sociales (Facebook, Instagram, TikTok, LinkedIn, WhatsApp). Inspirada en la potencia de herramientas como SocialBee, pero con un enfoque agresivo en métricas, inyección de presupuesto inteligente y automatización.

## 🛠 Stack Tecnológico

### Backend (Ruby on Rails API)
- **Versión:** Ruby 3.2.2 | Rails 7.1.6
- **Base de Datos:** PostgreSQL 18
- **Autenticación:** Devise + Devise-JWT (Estrategia JSON)
- **Tareas Asíncronas:** Sidekiq 6.5.5 (Namespace `laniakea`)
- **Almacenamiento:** ActiveStorage + DigitalOcean Spaces
- **Pagos:** Stripe Integration (Suscripciones, Checkout, Webhooks)

### Frontend (Next.js Application)
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes:** shadcn/ui (Diseño compacto y premium)
- **Estado:** Mobile First & PWA Ready

## 🛡️ Nuestra Ventaja Competitiva: El Diferenciador Laniakea

A diferencia de SocialBee, Buffer o Hootsuite, que se centran principalmente en la gestión orgánica y programación de contenido, **Laniakea está diseñada para ser una máquina de ROI**.

1.  **Smart Budgeting (Presupuesto Inteligente):** No solo programamos posts. Laniakea analiza el rendimiento en tiempo real y puede **inyectar presupuesto automáticamente** en los contenidos con mejor tracción, convirtiendo posts orgánicos exitosos en anuncios de alto rendimiento sin intervención manual.
2.  **Unificación de Orgánico y Paid:** Eliminamos la brecha entre el Social Media Manager (orgánico) y el Media Buyer (pagado). Todo ocurre en un mismo flujo de trabajo.
3.  **Tecnología Backend-Driven:** Nuestra arquitectura permite una escalabilidad global y una personalización instantánea (i18n y temas) controlada desde el core del negocio.

## 🚀 Hoja de Ruta (Roadmap)

### Fase 1: Cimientos (Completado ✅)
- Arquitectura base del Backend.
- Sistema de autenticación JWT.
- Integración base con Stripe (Modo Test).
- Estructura base del Frontend (Next.js + shadcn).

### Fase 2: Gestión de Contenido (En progreso 🚧)
- Calendario editorial interactivo.
- Creador de posts optimizado para cada red.
- Sistema de reciclaje de contenidos (Evergreen).

### Fase 3: Inteligencia y Automatización
- Integración de APIs de Social Ads (Meta, LinkedIn).
- Dashboard de métricas unificado.
- Automatización de presupuestos basada en KPIs.

### Fase 4: Escalamiento y Producción
- Migración de Stripe a modo Live.
- Optimización de PWA.
- Sistema de notificaciones en tiempo real vía ActionCable.

---

## 👨‍💻 Desarrollo Local

### Backend
```bash
bundle install
rails db:prepare
bundle exec sidekiq
rails s
```

### Frontend
```bash
cd frontend
yarn install
yarn dev
```

---
*Laniakea - Impulsando el contenido digital con inteligencia.*

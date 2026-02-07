# Configuración de Stripe CLI para Desarrollo Local

Laniakea utiliza Stripe para gestionar suscripciones. Para probar el flujo completo de pagos y webhooks en tu entorno local, necesitas ejecutar el CLI de Stripe.

## 1. Instalación (macOS)

Si aún no lo tienes instalado:

```bash
brew install stripe/stripe-cli/stripe
```

## 2. Autenticación

Conecta tu terminal con tu cuenta de Stripe:

```bash
stripe login
```
(Esto abrirá el navegador para autorizar el acceso).

## 3. Escuchar Webhooks (ESENCIAL)

Para que tu servidor local (`localhost:3000`) reciba los eventos de pago (como `checkout.session.completed`), debes abrir un túnel con Stripe.

**Ejecuta este comando en una terminal separada y déjala abierta:**

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

## 4. Obtener el Webhook Secret

Cuando ejecutes el comando anterior, verás un mensaje como este:

```text
> Ready! You are using Stripe API Version [2023-10-16]. Your webhook signing secret is whsec_...
```

1.  Copia el código que empieza con `whsec_`.
2.  Pégalo en tu archivo `config/application.yml` bajo la clave `STRIPE_WEBHOOK_SECRET` en el bloque `development`.

```yaml
development:
  # ...
  STRIPE_WEBHOOK_SECRET: "whsec_tu_codigo_secreto_aqui"
```

## 5. Probar Webhooks

Puedes disparar eventos de prueba manualmente si lo deseas:

```bash
stripe trigger payment_intent.succeeded
```

¡Listo! Ahora tu entorno local recibirá notificaciones reales de Stripe.

import Stripe from "stripe";
import { tenantService } from "../tenant/tenant.controller";
import { Tenant } from "../tenant/tenant.entity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

export const paymentService = {
  createStripeCustomer: async (tenant: Tenant) => {
    return stripe.customers
      .create({
        email: tenant.email,
        name: tenant.workspace_name,
        metadata: {
          tenantId: tenant.id,
        },
      })
      .catch((err) => {
        console.error(err.message);
      });
  },

  createStripeSubscription: async (
    tenant: Tenant,
    stripCustomerId: string,
    priceId: string
  ) => {
    return stripe.subscriptions
      .create({
        customer: stripCustomerId,
        items: (await tenant.channels).map(() => ({ price: priceId })),
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          tenantId: tenant.id,
        },
      })
      .catch((err) => {
        console.error(err.message);
      });
  },

  cancelStripeSubscription: async (subscriptionId: string) => {
    return stripe.subscriptions.cancel(subscriptionId).catch((err) => {
      console.error(err.message);
    });
  },

  createStripeWebhookEvent: async (rawBody, stripeSig) => {
    return stripe.webhooks.constructEvent(
      rawBody,
      stripeSig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  },

  getStripeCustomer: async (tenant: Tenant) => {
    return stripe.customers
      .retrieve(tenant.stripe_customer_id, {})
      .catch((err) => {
        console.error(err.message);
      });
  },

  getStripeSubscription: async (subscriptionId: string) => {
    return stripe.subscriptions.retrieve(subscriptionId).catch((err) => {
      console.error(err.message);
    });
  },

  updateStripeSubscription: async (tenant: Tenant) => {
    const subscription = await paymentService.getStripeSubscription(
      tenant.stripe_subscription_id
    );
    if (!subscription) {
      return;
    }
    const subscriptionItem = subscription.items.data[0];
    await stripe.subscriptionItems
      .update(subscriptionItem.id, {
        quantity: (await tenant.channels).length,
      })
      .catch((err) => {
        console.error(err.message);
      });
  },
};

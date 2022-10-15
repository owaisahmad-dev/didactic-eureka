import { App } from "@slack/bolt";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { Request, Response, Router } from "express";
import * as express from "express";
import Stripe from "stripe";
import { TypedRequestBody } from "../../types";
import { tenantService } from "../tenant/tenant.controller";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { paymentService } from "./payment.service";
import { authMiddleware } from "../middlewares/auth";

const paymentController = Router();
paymentController.use(authMiddleware);

paymentController.post(
  "/create-subscription",
  express.json(),
  async (req: TypedRequestBody<CreateSubscriptionDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(CreateSubscriptionDto, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { tenantId, priceId } = dto;
    const tenant = await tenantService.findTenantById(tenantId);
    if (!tenant) {
      return res.status(404).send({ error: "Tenant not found" });
    }

    let stripeCustomer: Stripe.Customer | void;
    if (tenant.stripe_customer_id) {
      const customer = await paymentService.getStripeCustomer(tenant);
      if (customer && !customer.deleted) {
        stripeCustomer = customer as Stripe.Customer;
      }
    }

    if (!stripeCustomer) {
      stripeCustomer = await paymentService.createStripeCustomer(tenant);
    }

    if (!stripeCustomer) {
      return res
        .status(500)
        .send({ error: "Failed to create customer in stripe" });
    }

    const subscription = await paymentService.createStripeSubscription(
      tenant,
      stripeCustomer.id,
      priceId
    );

    if (!subscription) {
      return res
        .status(500)
        .send({ error: "Failed to create subscription in stripe" });
    }
    const clientSecret =
      typeof subscription.latest_invoice !== "string"
        ? typeof subscription.latest_invoice.payment_intent !== "string"
          ? subscription.latest_invoice.payment_intent.client_secret
          : undefined
        : undefined;

    if (!clientSecret) {
      await paymentService.cancelStripeSubscription(subscription.id);
      return res.send({ error: "Failed to get client secret" });
    }

    return res.send({
      subscriptionId: subscription.id,
      clientSecret,
    });
  }
);

paymentController.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    let event: Stripe.Event;
    try {
      event = await paymentService.createStripeWebhookEvent(
        req.body,
        req.headers["stripe-signature"]
      );
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }

    switch (event.type) {
      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        const tenantId = customer.metadata.tenantId;
        res.status(200).json({ message: "Payment succeeded" });
        tenantService.updateTenant(tenantId, {
          stripe_customer_id: customer.id,
        });
        return;
      }
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const tenantId = subscription.metadata.tenantId;
        res.status(200).json({ message: "Payment failed" });
        tenantService.updateTenant(tenantId, {
          stripe_subscription_id: subscription.id,
          subscription_type: subscription.items.data[0].price.id,
        });
        return;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        res.status(200).json({ message: "Payment failed" });
        const subscription = await paymentService.getStripeSubscription(
          subscriptionId
        );
        if (!subscription) {
          return;
        }
        tenantService.updateTenant(subscription.metadata.tenantId, {
          is_paid_plan: true,
          is_trial: false,
        });
        return;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const tenantId = subscription.metadata.tenantId;
        res.status(200).json({ message: "Payment failed" });
        tenantService.removeSubscription(tenantId);
        return;
      }

      default: {
        res.status(200).send("Thanks for your payment!");
        return;
      }
    }
    return;
  }
);

paymentController.get(
  "/:tenantId/next-billing-data",
  async (req: Request, res: Response) => {
    // get tenant id from url params
    const tenantId = req.params.tenantId;
    // get tenant from tenant service
    const tenant = await tenantService.findTenantById(tenantId);
    // if tenant not found, return 404
    if (!tenant) {
      return res.status(404).send({ error: "Tenant not found" });
    }
    // get subscription from payment service
    const subscription = await paymentService.getStripeSubscription(
      tenant.stripe_subscription_id
    );

    if (!subscription) {
      return res.status(404).send({ error: "Subscription not found" });
    }
    // get next billing date from subscription
    const nextBillingTimestamp = subscription.current_period_end;
    const nextBillingDate = new Date();
    nextBillingDate.setTime(nextBillingTimestamp * 1000);

    // return next billing date in response
    return res.send({ nextBillingDate: nextBillingDate.toISOString() });
  }
);

paymentController.delete(
  "/:subscriptionId",
  async (req: Request, res: Response) => {
    const subscriptionId = req.params.subscriptionId;
    await paymentService.cancelStripeSubscription(subscriptionId);
    return res.status(200).send({ message: "Subscription cancelled" });
  }
);

export { paymentController };

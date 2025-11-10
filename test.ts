import { LegacyLogger } from "./structural/adapter/logger.example/legacy-logger";
import { LoggerAdapter } from "./structural/adapter/logger.example/logger.adapter";
import { PaymentAdapterGateway } from "./structural/adapter/payment.example/interface";
import { LegacyPayPal } from "./structural/adapter/payment.example/legacy-paypal";
import { PaypalAdaptor } from "./structural/adapter/payment.example/paypal.adapter";
import { Logististics } from "./creational/factory-principle/factory";
import { SeaLogistics } from "./creational/factory-principle/logistics/seaLogistics";
import { NotificationFactory } from "./creational/factory-principle/notification.example/factory";
import { EmailService } from "./creational/factory-principle/notification.example/services/email-service";
import { SmsService } from "./creational/factory-principle/notification.example/services/sms-service";
import { PaymentFactory } from "./creational/factory-principle/payment.example/factory";
import { MtnMomoPayment } from "./creational/factory-principle/payment.example/services/mtn-momo.payment";
import { StripePayment } from "./creational/factory-principle/payment.example/services/stripe";

async function testLogistics(logistics: Logististics) {
  await logistics.planDelivery();
}

const seaLogistics = new SeaLogistics();

async function testNotification(notification: NotificationFactory) {
  await notification.sendEmail();
}

async function testPayment(paymentGateway: PaymentFactory) {
  await paymentGateway.makePayment();
}

const emailService = new EmailService("mailchimp");
const smsService = new SmsService("hubtel");

const stripePayment = new StripePayment();
const mtnMomoPayment = new MtnMomoPayment();

// Adapter tests
async function testAdapter(paymentGateway: PaymentAdapterGateway) {
  await paymentGateway.charge(200);
}

async function testLogger(logger: LoggerAdapter) {
  await logger.log("This is a test log message.");
}

const legacyPaypal = new LegacyPayPal();

const paypalAdaptor: PaymentAdapterGateway = new PaypalAdaptor(legacyPaypal);

const legacyLogger = new LegacyLogger();
const loggerAdapter = new LoggerAdapter(legacyLogger);

export function main() {
  testLogistics(seaLogistics);
  testNotification(emailService);
  testNotification(smsService);
  testPayment(stripePayment);
  testPayment(mtnMomoPayment);
  testAdapter(paypalAdaptor);
  testLogger(loggerAdapter);
}

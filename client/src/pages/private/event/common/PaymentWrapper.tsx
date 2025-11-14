// src/pages/private/event/common/PaymentWrapper.tsx
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import axiosInstance from "../../../../axiosConfig";
import PaymentModal from "./payment-modal";
import { EventType } from "../../../../interfaces";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/** Props type */
type PaymentWrapperProps = {
  showPaymentModal: boolean;
  setShowPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTicketType: string;
  selectedTicketsCount: number;
  totalAmount: number;
  event: EventType;
};

function PaymentWrapper({
  showPaymentModal,
  setShowPaymentModal,
  selectedTicketType,
  selectedTicketsCount,
  totalAmount,
  event,
}: PaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    const createIntent = async () => {
      try {
        const response = await axiosInstance.post("/api/payments/create-payment-intent", {
          amount: totalAmount,
        });
        // Asegúrate que el backend devuelve { clientSecret: "..." }
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Error creando PaymentIntent:", err);
      }
    };

    if (showPaymentModal) {
      createIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPaymentModal, totalAmount]); // totalAmount en deps por si cambia

  if (!clientSecret) return null;

  const options: StripeElementsOptions = {
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentModal
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        selectedTicketType={selectedTicketType}
        selectedTicketsCount={selectedTicketsCount}
        totalAmount={totalAmount}
        event={event}
      />
    </Elements>
  );
}

export default PaymentWrapper;

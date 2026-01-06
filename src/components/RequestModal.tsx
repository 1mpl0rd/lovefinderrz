// src/components/RequestModal.tsx
import {
  PortalElement,
  Text,
  PortalTrigger,
  Icon,
  Badge,
} from "@1mpl0rd/react-ui-components";
import { usePortalProvider } from "@1mpl0rd/react-ui-components";
import { ChevronDown } from "@1mpl0rd/react-ui-icons";
import { useState } from "react";
import { DateRequestForm } from "./forms/DateRequestForm";
import { CallRequestForm } from "./forms/CallRequestForm";
import { NudesRequestForm } from "./forms/NudesRequestForm";
import type { Request, RequestType } from "../types/requests";
import { sendRequestEmail } from "../services/emailService";

interface RequestModalProps {
  timeLeft: number;
  onMessageSent?: () => void;
}

const RequestModal = ({ timeLeft, onMessageSent }: RequestModalProps) => {
  const { closePortalElement } = usePortalProvider();
  const [requestType, setRequestType] = useState<RequestType>("date");

  const handleSubmit = async (data: Request) => {
    console.log("Form submitted:", data);

    // Hier Email-Versand implementieren
    try {
      await sendRequestEmail(data);

      // Callback für erfolgreichen Versand
      onMessageSent?.();

      closePortalElement("main-portal");
    } catch (error) {
      console.error("Failed to send request:", error);
      // Zeige Fehlermeldung
    }
  };

  const handleCancel = () => {
    closePortalElement("main-portal");
  };

  const getTitle = () => {
    switch (requestType) {
      case "date":
        return "📍 Date";
      case "call":
        return "📞 Call";
      case "nudes":
        return "🔥 Nudes";
    }
  };

  return (
    <PortalElement
      id="main-portal"
      transitionClassName="fade-transition"
      closeOnOutsideClick={false}
      hasCurtain
    >
      <div className="fixed inset-[5%] bg-[rgb(var(--bgColor-default))] m-auto max-w-[28rem] p-4 flex h-max flex-col gap-4 border border-[rgb(var(--borderColor-default))]">
        <PortalTrigger
          id="request-popover"
          triggerType="click"
          position="bottom-start"
        >
          <div className="flex items-center w-max cursor-pointer">
            <Text as="h3" variant="headingLg">
              {getTitle()}
            </Text>
            <Icon size={24} source={ChevronDown} />
          </div>
        </PortalTrigger>

        <PortalElement
          id="request-popover"
          transitionClassName="fade-transition"
          closeOnOutsideClick={true}
        >
          <div className="absolute mt-1 bg-[rgb(var(--bgColor-default))] whitespace-nowrap flex h-max flex-col gap-2 border border-[rgb(var(--borderColor-default))]">
            <ul className="flex h-max flex-col">
              <li
                className={`p-2 ${
                  requestType === "date"
                    ? "cursor-default bg-[rgb(var(--bgColor-fill-button))]"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  setRequestType("date");
                  closePortalElement("request-popover");
                }}
              >
                📍 Date
              </li>
              <li
                className={`p-2 ${
                  requestType === "call"
                    ? "cursor-default bg-[rgb(var(--bgColor-fill-button))]"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  setRequestType("call");
                  closePortalElement("request-popover");
                }}
              >
                📞 Call
              </li>
              <li
                className={`p-2 ${
                  requestType === "nudes"
                    ? "cursor-default bg-[rgb(var(--bgColor-fill-button))]"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  setRequestType("nudes");
                  closePortalElement("request-popover");
                }}
              >
                🔥 Nudes <Badge tone="info">Beta</Badge>
              </li>
            </ul>
          </div>
        </PortalElement>

        {requestType === "date" && (
          <DateRequestForm
            timeLeft={timeLeft}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
        {requestType === "call" && (
          <CallRequestForm
            timeLeft={timeLeft}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
        {requestType === "nudes" && (
          <NudesRequestForm
            timeLeft={timeLeft}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </PortalElement>
  );
};

export default RequestModal;

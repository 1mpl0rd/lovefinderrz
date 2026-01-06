// src/components/forms/CallRequestForm.tsx
import { TextField, Button } from "@1mpl0rd/react-ui-components";
import { useState } from "react";
import type { CallRequest } from "../../types/requests";

interface CallRequestFormProps {
  timeLeft: number;
  onSubmit: (data: CallRequest) => Promise<void>;
  onCancel: () => void;
}

export const CallRequestForm = ({
  timeLeft,
  onSubmit,
  onCancel,
}: CallRequestFormProps) => {
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = date && time;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        type: "call",
        date,
        time,
        comment: comment || "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setIsSubmitting(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Datum"
        type="date"
        value={date}
        onChange={setDate}
        requiredIndicator
        disabled={isSubmitting}
      />
      <TextField
        label="Zeit"
        type="time"
        value={time}
        onChange={setTime}
        requiredIndicator
        disabled={isSubmitting}
      />
      <TextField
        label="Kommentar"
        multiline
        type="text"
        value={comment}
        onChange={setComment}
        disabled={isSubmitting}
      />
      <div className="flex justify-end gap-2">
        <Button variant="tertiary" onClick={onCancel} disabled={isSubmitting}>
          Nein, Danke!
        </Button>
        <Button
          variant="primary"
          disabled={!isValid}
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          Anfragen ({formatTime(timeLeft)})
        </Button>
      </div>
    </div>
  );
};

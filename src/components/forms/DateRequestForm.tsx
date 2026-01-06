// src/components/forms/DateRequestForm.tsx
import { TextField, Button } from "@1mpl0rd/react-ui-components";
import { useState } from "react";
import type { DateRequest } from "../../types/requests";

interface DateRequestFormProps {
  timeLeft: number;
  onSubmit: (data: DateRequest) => Promise<void>;
  onCancel: () => void;
}

export const DateRequestForm = ({
  timeLeft,
  onSubmit,
  onCancel,
}: DateRequestFormProps) => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = location && date && time;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        type: "date",
        location,
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
        label="Ort"
        value={location}
        onChange={setLocation}
        placeholder="Wo soll das Date stattfinden?"
        requiredIndicator
        disabled={isSubmitting}
      />
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

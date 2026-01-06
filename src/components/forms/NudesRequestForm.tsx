// src/components/forms/NudesRequestForm.tsx
import { TextField, Button } from "@1mpl0rd/react-ui-components";
import { useState } from "react";
import type { NudesRequest } from "../../types/requests";

interface NudesRequestFormProps {
  timeLeft: number;
  onSubmit: (data: NudesRequest) => Promise<void>;
  onCancel: () => void;
}

export const NudesRequestForm = ({
  timeLeft,
  onSubmit,
  onCancel,
}: NudesRequestFormProps) => {
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = content.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        type: "nudes",
        content,
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
        label="Inhalt"
        value={content}
        onChange={setContent}
        placeholder="Was möchtest du sehen?"
        multiline
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

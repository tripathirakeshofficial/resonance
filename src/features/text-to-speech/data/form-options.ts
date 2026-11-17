import { formOptions } from "@tanstack/react-form";

export interface TTSFormValues {
  text: string;
  voiceId: string;
  temperature: number;
  topP: number;
  topK: number;
  repetitionPenalty: number;
}

export const defaultTTSValues: TTSFormValues = {
  text: "",
  voiceId: "",
  temperature: 0.8,
  topP: 0.95,
  topK: 1000,
  repetitionPenalty: 1.2,
};

export const ttsFormOptions = formOptions({
  defaultValues: defaultTTSValues,
});

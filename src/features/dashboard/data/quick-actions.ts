export interface QuickAction {
  title: string;
  description: string;
  gradient: string;
  href: string;
}

export const quickActions: QuickAction[] = [
  {
    title: "Narrate a Story",
    description: "Turn your text into expressive storytelling",
    gradient: "from-cyan-400 to-cyan-50",
    href: `/text-to-speech?text=${encodeURIComponent(
      "The moonlit forest was silent until a tiny fox heard a mysterious whisper calling its name. Curious but brave, it followed the glowing trail and discovered a hidden world beyond the trees.",
    )}`,
  },
  {
    title: "Record an Ad",
    description: "Create an engaging voiceover for your next advertisement",
    gradient: "from-orange-400 to-orange-50",
    href: `/text-to-speech?text=${encodeURIComponent(
      "Discover a better way to start your day. Fresh, simple, and made for you. Try it today and experience the difference.",
    )}`,
  },
  {
    title: "Direct a Movie Scene",
    description: "Bring cinematic dialogue and dramatic scenes to life",
    gradient: "from-violet-400 to-violet-50",
    href: `/text-to-speech?text=${encodeURIComponent(
      "You have one chance. If you walk through that door, there is no turning back. The room fell silent as she slowly reached for the handle.",
    )}`,
  },
  {
    title: "Voice a Game Character",
    description: "Give your game characters a unique and memorable voice",
    gradient: "from-emerald-400 to-emerald-50",
    href: `/text-to-speech?text=${encodeURIComponent(
      "You made it this far, warrior. But the real challenge begins now. Draw your sword and prepare yourself for what lies ahead.",
    )}`,
  },
  {
    title: "Introduce Your Podcast",
    description: "Create a polished and engaging introduction for your show",
    gradient: "from-rose-400 to-rose-50",
    href: `/text-to-speech?text=${encodeURIComponent(
      "Welcome to the show, where we explore fascinating ideas, inspiring stories, and the people shaping the world around us. Let's get started.",
    )}`,
  },
  {
    title: "Guide a Meditation",
    description: "Create a calm and soothing guided meditation",
    gradient: "from-blue-400 to-blue-50",
    href: `/text-to-speech?text=${encodeURIComponent(
      "Take a slow, deep breath. Close your eyes and allow your body to relax. Let go of the tension and focus on the calm rhythm of your breathing.",
    )}`,
  },
];
